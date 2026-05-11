<?php

namespace Tests\Feature\Services;

use App\Domain\Reviews\Services\ReviewService;
use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class ReviewServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_review_a_paid_non_cancelled_purchased_product(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();
        $this->createPurchasedOrderItem($user, $product);

        $review = $this->reviewService()->createUserReview($user, $product, [
            'rating' => 5,
            'comment' => 'Producto comprado y reseñado.',
        ]);

        $this->assertInstanceOf(Review::class, $review);
        $this->assertSame($user->getKey(), $review->user_id);
        $this->assertSame($product->getKey(), $review->product_id);
        $this->assertSame(5, $review->rating);
        $this->assertFalse($review->is_approved);
    }

    public function test_user_cannot_review_a_product_that_was_not_purchased(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $this->expectException(AuthorizationException::class);

        $this->reviewService()->createUserReview($user, $product, [
            'rating' => 4,
            'comment' => 'Intento no permitido.',
        ]);
    }

    public function test_user_cannot_review_a_product_from_unpaid_or_cancelled_orders(): void
    {
        $user = User::factory()->create();
        $unpaidProduct = Product::factory()->create();
        $cancelledProduct = Product::factory()->create();

        $this->createPurchasedOrderItem($user, $unpaidProduct, [
            'payment_status' => 'pending',
        ]);
        $this->createPurchasedOrderItem($user, $cancelledProduct, [
            'status' => OrderStatus::Cancelled->value,
        ]);

        $this->assertFalse($this->canCreateReview($user, $unpaidProduct));
        $this->assertFalse($this->canCreateReview($user, $cancelledProduct));
    }

    public function test_user_cannot_review_the_same_product_twice(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();
        $this->createPurchasedOrderItem($user, $product);

        $this->reviewService()->createUserReview($user, $product, [
            'rating' => 5,
            'comment' => 'Primera reseña.',
        ]);

        $this->expectException(ValidationException::class);

        $this->reviewService()->createUserReview($user, $product, [
            'rating' => 4,
            'comment' => 'Segunda reseña.',
        ]);
    }

    public function test_only_admins_can_update_approve_or_delete_reviews(): void
    {
        $admin = User::factory()->admin()->create();
        $customer = User::factory()->create();
        $review = Review::factory()->pending()->create([
            'rating' => 3,
            'comment' => 'Pendiente.',
        ]);

        $updatedReview = $this->reviewService()->updateAsAdmin($admin, $review, [
            'rating' => 4,
            'comment' => 'Editada por admin.',
        ]);
        $this->assertSame(4, $updatedReview->rating);
        $this->assertSame('Editada por admin.', $updatedReview->comment);

        $approvedReview = $this->reviewService()->approveAsAdmin($admin, $review);
        $this->assertTrue($approvedReview->is_approved);

        $this->expectException(AuthorizationException::class);
        $this->reviewService()->deleteAsAdmin($customer, $review);
    }

    public function test_admin_can_delete_reviews(): void
    {
        $admin = User::factory()->admin()->create();
        $review = Review::factory()->create();

        $this->assertTrue($this->reviewService()->deleteAsAdmin($admin, $review));
        $this->assertDatabaseMissing('review', [
            'id' => $review->getKey(),
        ]);
    }

    public function test_review_service_exposes_repository_queries(): void
    {
        $targetProduct = Product::factory()->create();
        $otherProduct = Product::factory()->create();
        $targetUser = User::factory()->create();
        $otherUser = User::factory()->create();

        $approvedReview = Review::factory()
            ->approved()
            ->for($targetUser)
            ->for($targetProduct)
            ->create();
        $pendingReview = Review::factory()
            ->pending()
            ->for($otherUser)
            ->for($targetProduct)
            ->create();
        $otherProductReview = Review::factory()
            ->approved()
            ->for($targetUser)
            ->for($otherProduct)
            ->create();

        $approvedProductReviews = $this->reviewService()->getApprovedProductReviews($targetProduct);
        $pendingReviews = $this->reviewService()->getPendingReviews();
        $userReviews = $this->reviewService()->getUserReviews($targetUser);
        $adminReviews = $this->reviewService()->getAdminReviews();

        $this->assertTrue($approvedProductReviews->contains($approvedReview));
        $this->assertFalse($approvedProductReviews->contains($pendingReview));
        $this->assertTrue($pendingReviews->contains($pendingReview));
        $this->assertFalse($pendingReviews->contains($approvedReview));
        $this->assertTrue($userReviews->contains($approvedReview));
        $this->assertTrue($userReviews->contains($otherProductReview));
        $this->assertCount(3, $adminReviews);
    }

    private function reviewService(): ReviewService
    {
        return app(ReviewService::class);
    }

    /**
     * @param  array<string, mixed>  $orderAttributes
     */
    private function createPurchasedOrderItem(User $user, Product $product, array $orderAttributes = []): OrderItem
    {
        $order = Order::factory()
            ->paid()
            ->processing()
            ->for($user)
            ->create($orderAttributes);

        return OrderItem::factory()
            ->forOrder($order)
            ->forProduct($product)
            ->create();
    }

    private function canCreateReview(User $user, Product $product): bool
    {
        try {
            $this->reviewService()->createUserReview($user, $product, [
                'rating' => 4,
                'comment' => 'Intento de reseña.',
            ]);

            return true;
        } catch (AuthorizationException) {
            return false;
        }
    }
}
