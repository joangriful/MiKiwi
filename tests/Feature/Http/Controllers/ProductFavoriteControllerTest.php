<?php

namespace Tests\Feature\Http\Controllers;

use App\Enums\ProductType;
use App\Models\Product;
use App\Models\ProductFavorite;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductFavoriteControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_mark_product_as_favorite(): void
    {
        /** @var User $user */
        $user = User::factory()->create();
        /** @var Product $product */
        $product = Product::factory()->create($this->publicProductState());

        $this->actingAs($user)
            ->postJson(route('products.favorite.store', $product->slug))
            ->assertOk()
            ->assertJson([
                'success' => true,
                'is_favorite' => true,
            ]);

        $this->assertDatabaseHas('product_favorite', [
            'user_id' => $user->getKey(),
            'product_id' => $product->getKey(),
        ]);
    }

    public function test_marking_product_as_favorite_is_idempotent(): void
    {
        /** @var User $user */
        $user = User::factory()->create();
        /** @var Product $product */
        $product = Product::factory()->create($this->publicProductState());

        $this->actingAs($user)->postJson(route('products.favorite.store', $product->slug))->assertOk();
        $this->actingAs($user)->postJson(route('products.favorite.store', $product->slug))->assertOk();

        $this->assertSame(1, ProductFavorite::query()
            ->where('user_id', $user->getKey())
            ->where('product_id', $product->getKey())
            ->count());
    }

    public function test_authenticated_user_can_remove_product_from_favorites(): void
    {
        /** @var User $user */
        $user = User::factory()->create();
        /** @var Product $product */
        $product = Product::factory()->create($this->publicProductState());

        ProductFavorite::query()->create([
            'user_id' => $user->getKey(),
            'product_id' => $product->getKey(),
        ]);

        $this->actingAs($user)
            ->deleteJson(route('products.favorite.destroy', $product->slug))
            ->assertOk()
            ->assertJson([
                'success' => true,
                'is_favorite' => false,
            ]);

        $this->assertDatabaseMissing('product_favorite', [
            'user_id' => $user->getKey(),
            'product_id' => $product->getKey(),
        ]);
    }

    public function test_guest_cannot_mark_product_as_favorite(): void
    {
        /** @var Product $product */
        $product = Product::factory()->create($this->publicProductState());

        $this->postJson(route('products.favorite.store', $product->slug))
            ->assertUnauthorized();
    }

    public function test_catalog_marks_products_favorited_by_authenticated_user(): void
    {
        /** @var User $user */
        $user = User::factory()->create();
        /** @var Product $favoriteProduct */
        $favoriteProduct = Product::factory()->create($this->publicProductState([
            'slug' => 'favorite-product',
            'created_at' => now()->addMinute(),
        ]));
        /** @var Product $regularProduct */
        $regularProduct = Product::factory()->create($this->publicProductState([
            'slug' => 'regular-product',
            'created_at' => now(),
        ]));

        ProductFavorite::query()->create([
            'user_id' => $user->getKey(),
            'product_id' => $favoriteProduct->getKey(),
        ]);

        $this->actingAs($user)
            ->get(route('products.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('products.data.0.slug', $favoriteProduct->slug)
                ->where('products.data.0.is_favorite', true)
                ->where('products.data.1.slug', $regularProduct->slug)
                ->where('products.data.1.is_favorite', false)
            );
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function publicProductState(array $overrides = []): array
    {
        return array_merge([
            'is_active' => true,
            'stock_quantity' => 10,
            'product_type' => ProductType::Simple->value,
        ], $overrides);
    }
}
