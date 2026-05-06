<?php

namespace Tests\Feature;

use App\Enums\ProductType;
use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductPublicExposureTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_product_page_only_returns_approved_reviews(): void
    {
        $product = $this->createPublicProduct(['slug' => 'public-product']);
        $user = User::factory()->create();

        Review::factory()->approved()->for($user)->for($product)->create([
            'rating' => 5,
            'comment' => 'Visible approved review.',
        ]);

        Review::factory()->pending()->for($user)->for($product)->create([
            'rating' => 1,
            'comment' => 'Hidden pending review.',
        ]);

        $this->get(route('products.show', $product->slug))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Catalog/ProductPage')
                ->has('product.reviews', 1)
                ->where('product.reviews.0.rating', 5)
                ->where('product.reviews.0.comment', 'Visible approved review.')
                ->missing('product.reviews.0.user_id')
                ->missing('product.reviews.0.product_id')
                ->missing('product.reviews.0.is_approved')
            );
    }

    public function test_public_product_api_show_does_not_expose_review_internal_fields(): void
    {
        $product = $this->createPublicProduct(['slug' => 'api-product']);
        $user = User::factory()->create();

        Review::factory()->approved()->for($user)->for($product)->create([
            'rating' => 4,
            'comment' => 'API visible review.',
        ]);

        Review::factory()->pending()->for($user)->for($product)->create([
            'rating' => 2,
            'comment' => 'API hidden pending review.',
        ]);

        $payload = $this->getJson("/api/products/{$product->slug}")
            ->assertOk()
            ->json();

        $review = data_get($payload, 'data.product.reviews.0');

        $this->assertSame(4, $review['rating']);
        $this->assertSame('API visible review.', $review['comment']);
        $this->assertCount(1, data_get($payload, 'data.product.reviews'));
        $this->assertPayloadDoesNotExposeKeys($review, $this->privateReviewKeys());
    }

    public function test_public_products_api_index_does_not_expose_product_internal_fields(): void
    {
        $this->createPublicProduct(['slug' => 'api-index-product']);

        $payload = $this->getJson('/api/products')
            ->assertOk()
            ->json();

        $product = data_get($payload, 'data.0');

        $this->assertSame('api-index-product', $product['slug']);
        $this->assertPublicProductPayload($product);
    }

    public function test_catalog_page_does_not_expose_product_internal_fields(): void
    {
        $product = $this->createPublicProduct(['slug' => 'catalog-product']);
        $this->createPublicProduct([
            'slug' => 'catalog-configurable-product',
            'product_type' => ProductType::Configurable->value,
        ]);

        $this->get(route('products.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Catalog/Products')
                ->where('products.data.0.slug', $product->slug)
                ->has('products.data', 1)
                ->missing('products.data.0.category_id')
                ->missing('products.data.0.stock_quantity')
                ->missing('products.data.0.is_active')
                ->missing('products.data.0.created_at')
                ->missing('products.data.0.updated_at')
            );
    }

    public function test_home_page_does_not_expose_featured_product_internal_fields(): void
    {
        $product = $this->createPublicProduct([
            'slug' => 'home-featured-product',
            'is_promoted' => true,
            'stock_quantity' => 10,
        ]);
        $this->createPublicProduct([
            'slug' => 'home-featured-component',
            'is_promoted' => true,
            'stock_quantity' => 10,
            'product_type' => ProductType::Component->value,
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Home/Home')
                ->where('featuredProducts.0.slug', $product->slug)
                ->has('featuredProducts', 1)
                ->missing('featuredProducts.0.category_id')
                ->missing('featuredProducts.0.stock_quantity')
                ->missing('featuredProducts.0.is_active')
                ->missing('featuredProducts.0.created_at')
                ->missing('featuredProducts.0.updated_at')
            );
    }

    public function test_cart_page_does_not_expose_public_product_internal_fields(): void
    {
        $product = $this->createPublicProduct(['slug' => 'cart-product']);
        $hiddenProduct = $this->createPublicProduct([
            'slug' => 'cart-component-product',
            'product_type' => ProductType::Component->value,
        ]);
        $popularProduct = $this->createPublicProduct(['slug' => 'popular-cart-product']);
        $this->createPublicProduct([
            'slug' => 'popular-configurable-product',
            'product_type' => ProductType::Configurable->value,
        ]);

        session([
            'shopping_cart' => [
                $product->id => [
                    'slug' => $product->slug,
                    'quantity' => 1,
                    'accessories' => [],
                ],
                $hiddenProduct->id => [
                    'slug' => $hiddenProduct->slug,
                    'quantity' => 1,
                    'accessories' => [],
                ],
            ],
        ]);

        $this->get(route('cart.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Checkout/Cart')
                ->where('cart.items.0.product.slug', $product->slug)
                ->missing('cart.items.0.product.category_id')
                ->missing('cart.items.0.product.stock_quantity')
                ->missing('cart.items.0.product.is_active')
                ->missing('cart.items.0.product.created_at')
                ->missing('cart.items.0.product.updated_at')
                ->has('cart.items', 1)
                ->where('popularProducts.0.product_type', ProductType::Simple->value)
                ->missing('popularProducts.0.category_id')
                ->missing('popularProducts.0.stock_quantity')
                ->missing('popularProducts.0.is_active')
                ->missing('popularProducts.0.created_at')
                ->missing('popularProducts.0.updated_at')
                ->has('popularProducts', 2)
            );

        $this->assertDatabaseHas('product', [
            'id' => $popularProduct->id,
            'product_type' => ProductType::Simple->value,
        ]);
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function createPublicProduct(array $overrides = []): Product
    {
        $category = Category::factory()->create([
            'is_active' => true,
            'slug' => ($overrides['slug'] ?? fake()->slug()).'-category',
        ]);

        return Product::factory()->create(array_merge([
            'category_id' => $category->id,
            'is_active' => true,
            'is_promoted' => false,
            'stock_quantity' => 20,
            'product_type' => ProductType::Simple->value,
        ], $overrides));
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function assertPublicProductPayload(array $payload): void
    {
        foreach ($this->privateProductKeys() as $key) {
            $this->assertArrayNotHasKey($key, $payload);
        }
    }

    /**
     * @param  array<string, mixed>  $payload
     * @param  array<int, string>  $keys
     */
    private function assertPayloadDoesNotExposeKeys(array $payload, array $keys): void
    {
        foreach ($keys as $key) {
            $this->assertArrayNotHasKey($key, $payload);
        }
    }

    /**
     * @return array<int, string>
     */
    private function privateProductKeys(): array
    {
        return [
            'category_id',
            'stock_quantity',
            'is_active',
            'created_at',
            'updated_at',
        ];
    }

    /**
     * @return array<int, string>
     */
    private function privateReviewKeys(): array
    {
        return [
            'user_id',
            'product_id',
            'is_approved',
            'created_at',
            'updated_at',
        ];
    }
}
