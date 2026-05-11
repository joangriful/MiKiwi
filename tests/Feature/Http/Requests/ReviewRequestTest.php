<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Requests;

use App\Http\Requests\Admin\StoreAdminReviewRequest;
use App\Http\Requests\Admin\UpdateAdminReviewRequest;
use App\Http\Requests\StoreReviewRequest;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class ReviewRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_review_request_validates_user_review_payload(): void
    {
        $request = new StoreReviewRequest;

        $this->assertTrue(Validator::make([], $request->rules())->fails());
        $this->assertFalse(Validator::make([
            'rating' => 5,
            'comment' => str_repeat('a', 2000),
        ], $request->rules())->fails());

        $validator = Validator::make([
            'rating' => 6,
            'comment' => str_repeat('a', 2001),
        ], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('rating', $validator->errors()->messages());
        $this->assertArrayHasKey('comment', $validator->errors()->messages());
    }

    public function test_store_review_request_requires_authenticated_user(): void
    {
        $request = new StoreReviewRequest;
        $this->assertFalse($request->authorize());

        $request = $this->withUser(new StoreReviewRequest, User::factory()->create());

        $this->assertTrue($request->authorize());
    }

    public function test_store_admin_review_request_validates_admin_payload(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();
        $request = new StoreAdminReviewRequest;

        $this->assertTrue(Validator::make([], $request->rules())->fails());
        $this->assertFalse(Validator::make([
            'user_id' => $user->getKey(),
            'product_id' => $product->getKey(),
            'rating' => 4,
            'comment' => null,
            'is_approved' => true,
        ], $request->rules())->fails());

        $validator = Validator::make([
            'user_id' => 'not-a-uuid',
            'product_id' => 'not-a-uuid',
            'rating' => 0,
            'comment' => str_repeat('a', 2001),
            'is_approved' => 'not-boolean',
        ], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('user_id', $validator->errors()->messages());
        $this->assertArrayHasKey('product_id', $validator->errors()->messages());
        $this->assertArrayHasKey('rating', $validator->errors()->messages());
        $this->assertArrayHasKey('comment', $validator->errors()->messages());
        $this->assertArrayHasKey('is_approved', $validator->errors()->messages());
    }

    public function test_store_admin_review_request_requires_admin_user(): void
    {
        $customerRequest = $this->withUser(new StoreAdminReviewRequest, User::factory()->create());
        $adminRequest = $this->withUser(new StoreAdminReviewRequest, User::factory()->admin()->create());

        $this->assertFalse($customerRequest->authorize());
        $this->assertTrue($adminRequest->authorize());
    }

    public function test_update_admin_review_request_validates_admin_payload(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();
        $request = new UpdateAdminReviewRequest;

        $this->assertTrue(Validator::make([], $request->rules())->fails());
        $this->assertFalse(Validator::make([
            'user_id' => $user->getKey(),
            'product_id' => $product->getKey(),
            'rating' => 3,
            'comment' => 'Editada.',
            'is_approved' => false,
        ], $request->rules())->fails());
    }

    public function test_update_admin_review_request_requires_admin_user(): void
    {
        $review = Review::factory()->create();

        $customerRequest = $this->makeUpdateAdminReviewRequest($review, User::factory()->create());
        $adminRequest = $this->makeUpdateAdminReviewRequest($review, User::factory()->admin()->create());

        $this->assertFalse($customerRequest->authorize());
        $this->assertTrue($adminRequest->authorize());
    }

    private function makeUpdateAdminReviewRequest(Review $review, User $user): UpdateAdminReviewRequest
    {
        $request = UpdateAdminReviewRequest::create('/admin/reviews/'.$review->getKey(), HttpRequest::METHOD_PUT);
        $request->setUserResolver(fn () => $user);
        $request->setRouteResolver(fn (): object => new class($review)
        {
            public function __construct(private readonly Review $review) {}

            public function parameter(string $key, mixed $default = null): ?Review
            {
                return $key === 'review' ? $this->review : $default;
            }
        });

        return $request;
    }

    /**
     * @template T of \Illuminate\Foundation\Http\FormRequest
     *
     * @param  T  $request
     * @return T
     */
    private function withUser($request, User $user)
    {
        $request->setUserResolver(fn () => $user);

        return $request;
    }
}
