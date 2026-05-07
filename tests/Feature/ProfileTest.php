<?php

namespace Tests\Feature;

use App\Enums\ProductType;
use App\Models\Category;
use App\Models\Collection;
use App\Models\CollectionProduct;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_page_is_displayed(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/profile');

        $response->assertOk();
    }

    public function test_profile_page_returns_quiz_recommendations_from_collection_matches(): void
    {
        $user = User::factory()->create([
            'quiz_result_category' => 'Lubricantes',
        ]);

        $category = Category::factory()->create([
            'name' => 'Lubricantes',
            'slug' => 'lubricantes',
            'is_active' => true,
        ]);

        $collection = Collection::query()->create([
            'name' => 'Parejas',
            'slug' => 'parejas',
            'description' => 'Productos para disfrutar en pareja',
            'is_active' => true,
        ]);

        $recommendedProduct = Product::factory()->create([
            'category_id' => $category->getKey(),
            'name' => 'Lubricante Recomendado',
            'slug' => 'lubricante-recomendado',
            'sku' => 'TEST-LUBE-001',
            'is_active' => true,
            'stock_quantity' => 12,
            'product_type' => ProductType::Simple->value,
        ]);

        $recommendedProduct->images()->delete();

        ProductImage::query()->create([
            'product_id' => $recommendedProduct->getKey(),
            'public_id' => 'products/lubricante-recomendado/main',
            'image_url' => 'https://example.test/lubricante-recomendado-main.webp',
            'alt_text' => 'Lubricante recomendado',
            'sort_order' => 1,
        ]);

        ProductImage::query()->create([
            'product_id' => $recommendedProduct->getKey(),
            'public_id' => 'products/lubricante-recomendado/hover',
            'image_url' => 'https://example.test/lubricante-recomendado-hover.webp',
            'alt_text' => 'Lubricante recomendado hover',
            'sort_order' => 2,
        ]);

        CollectionProduct::query()->create([
            'collection_id' => $collection->getKey(),
            'product_id' => $recommendedProduct->getKey(),
        ]);

        Product::factory()->create([
            'category_id' => $category->getKey(),
            'name' => 'Producto Destacado Fallback',
            'slug' => 'producto-destacado-fallback',
            'sku' => 'TEST-FALLBACK-001',
            'is_active' => true,
            'is_promoted' => true,
            'stock_quantity' => 8,
            'product_type' => ProductType::Simple->value,
        ]);

        $this->actingAs($user)
            ->get('/perfil')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Profile/Profile')
                ->has('recommendedProducts', 1)
                ->where('recommendedProducts.0.slug', $recommendedProduct->slug)
                ->where('recommendedProducts.0.image_url', 'https://example.test/lubricante-recomendado-main.webp')
                ->where('recommendedProducts.0.hover_image_url', 'https://example.test/lubricante-recomendado-hover.webp')
            );
    }

    public function test_profile_information_can_be_updated(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertSame('test@example.com', $user->email);
        $this->assertNull($user->email_verified_at);
    }

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => 'Test User',
                'email' => $user->email,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_user_can_delete_their_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete('/profile', [
                'password' => 'password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/');

        $this->assertGuest();
        $this->assertSoftDeleted('users', [
            'id' => $user->getKey(),
        ]);
    }

    public function test_correct_password_must_be_provided_to_delete_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from('/profile')
            ->delete('/profile', [
                'password' => 'wrong-password',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect('/profile');

        $this->assertNull($user->fresh()?->deleted_at);
    }
}
