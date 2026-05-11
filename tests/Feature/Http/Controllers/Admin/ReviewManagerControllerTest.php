<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers\Admin;

use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewManagerControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_list_reviews(): void
    {
        $admin = User::factory()->admin()->create();
        $review = Review::factory()->approved()->create([
            'rating' => 5,
            'comment' => 'Visible para admin.',
        ]);

        $this->actingAs($admin)
            ->getJson(route('admin.reviews.index'))
            ->assertOk()
            ->assertJsonPath('reviews.0.id', $review->getKey())
            ->assertJsonPath('reviews.0.rating', 5)
            ->assertJsonPath('reviews.0.comment', 'Visible para admin.')
            ->assertJsonPath('reviews.0.is_approved', true);
    }

    public function test_admin_can_create_review(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $this->actingAs($admin)
            ->from(route('components.manager'))
            ->post(route('admin.reviews.store'), [
                'user_id' => $user->getKey(),
                'product_id' => $product->getKey(),
                'rating' => 4,
                'comment' => 'Creada por admin.',
                'is_approved' => true,
            ])
            ->assertRedirect(route('components.manager'));

        $this->assertDatabaseHas('review', [
            'user_id' => $user->getKey(),
            'product_id' => $product->getKey(),
            'rating' => 4,
            'comment' => 'Creada por admin.',
            'is_approved' => true,
        ]);
    }

    public function test_admin_can_update_approve_and_delete_review(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->create();
        $product = Product::factory()->create();
        $review = Review::factory()->pending()->create();

        $this->actingAs($admin)
            ->put(route('admin.reviews.update', $review), [
                'user_id' => $user->getKey(),
                'product_id' => $product->getKey(),
                'rating' => 3,
                'comment' => 'Actualizada.',
                'is_approved' => false,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('review', [
            'id' => $review->getKey(),
            'user_id' => $user->getKey(),
            'product_id' => $product->getKey(),
            'rating' => 3,
            'comment' => 'Actualizada.',
            'is_approved' => false,
        ]);

        $this->actingAs($admin)
            ->patch(route('admin.reviews.approve', $review))
            ->assertRedirect();

        $this->assertTrue($review->fresh()->is_approved);

        $this->actingAs($admin)
            ->delete(route('admin.reviews.destroy', $review))
            ->assertRedirect();

        $this->assertDatabaseMissing('review', [
            'id' => $review->getKey(),
        ]);
    }

    public function test_non_admin_cannot_access_review_management(): void
    {
        $customer = User::factory()->create();
        $review = Review::factory()->create();

        $this->actingAs($customer)
            ->get(route('admin.reviews.index'))
            ->assertRedirect(route('dashboard'));

        $this->actingAs($customer)
            ->delete(route('admin.reviews.destroy', $review))
            ->assertRedirect(route('dashboard'));
    }
}
