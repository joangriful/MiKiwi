<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_review_a_purchased_product(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();
        $this->createPurchasedOrderItem($user, $product);

        $this->actingAs($user)
            ->from(route('products.show', $product))
            ->post(route('products.reviews.store', $product), [
                'rating' => 5,
                'comment' => 'Muy buen producto.',
            ])
            ->assertRedirect(route('products.show', $product));

        $this->assertDatabaseHas('review', [
            'user_id' => $user->getKey(),
            'product_id' => $product->getKey(),
            'rating' => 5,
            'comment' => 'Muy buen producto.',
            'is_approved' => false,
        ]);
    }

    public function test_user_cannot_review_a_product_that_was_not_purchased(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $this->actingAs($user)
            ->post(route('products.reviews.store', $product), [
                'rating' => 4,
                'comment' => 'Intento no permitido.',
            ])
            ->assertForbidden();

        $this->assertDatabaseCount('review', 0);
    }

    public function test_guest_cannot_review_products(): void
    {
        $product = Product::factory()->create();

        $this->post(route('products.reviews.store', $product), [
            'rating' => 5,
            'comment' => 'Sin sesión.',
        ])->assertRedirect(route('login'));
    }

    private function createPurchasedOrderItem(User $user, Product $product): OrderItem
    {
        $order = Order::factory()
            ->paid()
            ->processing()
            ->for($user)
            ->create();

        return OrderItem::factory()
            ->forOrder($order)
            ->forProduct($product)
            ->create();
    }
}
