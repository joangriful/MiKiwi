<?php

namespace Tests\Feature\Http\Resources;

use App\Http\Resources\AdminReviewResource;
use App\Http\Resources\ReviewResource;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class ReviewResourceTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_review_resource_hides_internal_fields(): void
    {
        $user = User::factory()->create([
            'name' => 'Cliente Visible',
        ]);
        $review = Review::factory()->approved()->for($user)->create([
            'rating' => 5,
            'comment' => 'Visible.',
        ])->load('user');

        $payload = ReviewResource::make($review)->resolve(Request::create('/'));

        $this->assertSame(5, $payload['rating']);
        $this->assertSame('Visible.', $payload['comment']);
        $this->assertSame('Cliente Visible', $payload['user_name']);
        $this->assertArrayHasKey('created_at', $payload);
        $this->assertArrayNotHasKey('user_id', $payload);
        $this->assertArrayNotHasKey('product_id', $payload);
        $this->assertArrayNotHasKey('is_approved', $payload);
    }

    public function test_admin_review_resource_exposes_management_fields(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();
        $review = Review::factory()
            ->approved()
            ->for($user)
            ->for($product)
            ->create([
                'rating' => 4,
                'comment' => 'Gestionable.',
            ])
            ->load(['user', 'product']);

        $payload = AdminReviewResource::make($review)->resolve(Request::create('/'));

        $this->assertSame($review->getKey(), $payload['id']);
        $this->assertSame(4, $payload['rating']);
        $this->assertSame('Gestionable.', $payload['comment']);
        $this->assertTrue($payload['is_approved']);
        $this->assertSame($user->getKey(), $payload['user']['id']);
        $this->assertSame($user->email, $payload['user']['email']);
        $this->assertSame($product->getKey(), $payload['product']['id']);
        $this->assertSame($product->slug, $payload['product']['slug']);
        $this->assertArrayHasKey('created_at', $payload);
        $this->assertArrayNotHasKey('updated_at', $payload);
    }
}
