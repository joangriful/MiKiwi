<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Enums\ProductType;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\TestCase;

class ProductCatalogControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_products_index_only_returns_active_in_stock_products(): void
    {
        $visibleProduct = $this->createProduct([
            'slug' => 'visible-product',
            'is_active' => true,
            'stock_quantity' => 8,
        ]);

        $this->createProduct([
            'slug' => 'inactive-product',
            'is_active' => false,
            'stock_quantity' => 8,
        ]);

        $this->createProduct([
            'slug' => 'out-of-stock-product',
            'is_active' => true,
            'stock_quantity' => 0,
        ]);

        $this->createProduct([
            'slug' => 'configurable-product',
            'is_active' => true,
            'stock_quantity' => 8,
            'product_type' => ProductType::Configurable->value,
        ]);

        $payload = $this->getJson('/api/products')
            ->assertOk()
            ->json('data');

        $this->assertCount(1, $payload);
        $this->assertSame($visibleProduct->slug, $payload[0]['slug']);
    }

    public function test_product_show_returns_product_with_accessories(): void
    {
        $product = $this->createProduct(['slug' => 'configurable-product']);
        $accessory = $this->createProduct([
            'slug' => 'accessory-product',
            'product_type' => ProductType::Component->value,
        ]);

        DB::table('doll_product_accessory')->insert([
            'id' => (string) Str::uuid(),
            'doll_product_id' => $product->getKey(),
            'accessory_product_id' => $accessory->getKey(),
            'is_mandatory' => false,
            'group_name' => 'extras',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->getJson("/api/products/{$product->slug}")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.product.slug', 'configurable-product')
            ->assertJsonPath('data.accessories.0.slug', 'accessory-product')
            ->assertJsonMissingPath('data.product.stock_quantity');
    }

    public function test_product_show_returns_not_found_for_missing_or_inactive_product(): void
    {
        $this->createProduct([
            'slug' => 'inactive-product',
            'is_active' => false,
        ]);

        $this->getJson('/api/products/missing-product')
            ->assertNotFound()
            ->assertJson(['error' => 'Producto no encontrado']);

        $this->getJson('/api/products/inactive-product')
            ->assertNotFound()
            ->assertJson(['error' => 'Producto no encontrado']);
    }

    public function test_product_show_returns_not_found_for_non_simple_product(): void
    {
        $product = $this->createProduct([
            'slug' => 'component-product',
            'product_type' => ProductType::Component->value,
        ]);

        $this->getJson("/api/products/{$product->slug}")
            ->assertNotFound()
            ->assertJson(['error' => 'Producto no encontrado']);
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function createProduct(array $overrides = []): Product
    {
        $category = Category::factory()->create([
            'is_active' => true,
        ]);

        return Product::factory()->create(array_merge([
            'category_id' => $category->id,
            'is_active' => true,
            'stock_quantity' => 10,
            'product_type' => ProductType::Simple->value,
        ], $overrides));
    }
}
