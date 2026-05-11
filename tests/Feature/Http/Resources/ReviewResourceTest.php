<?php

namespace Tests\Feature\Http\Resources;

use App\Http\Resources\Admin\AdminReviewResource;
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
        $review = Review::factory()->approved()->create([
            'rating' => 5,
            'comment' => 'Visible.',
        ]);

        $payload = ReviewResource::make($review)->resolve(Request::create('/'));

        $this->assertSame([
            'rating' => 5,
            'comment' => 'Visible.',
        ], $payload);
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
        $this->assertArrayHasKey('updated_at', $payload);
    }
}
