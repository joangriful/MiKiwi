<?php

declare(strict_types=1);

namespace Tests\Feature\Services;

use App\Domain\Dolls\Services\ConfigurableDollProductService;
use App\Enums\ProductType;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConfigurableDollProductServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_ready_doll_products_returns_available_ready_dolls_in_frontend_order(): void
    {
        Product::factory()->doll()->create([
            'name' => 'Bikini',
            'slug' => 'bikini-doll',
            'sku' => 'DOLL-BIKINI-001',
            'is_active' => true,
            'stock_quantity' => 10,
        ]);
        Product::factory()->doll()->create([
            'name' => 'Queen',
            'slug' => 'queen-doll',
            'sku' => 'DOLL-QUEEN-001',
            'is_active' => true,
            'stock_quantity' => 10,
        ]);
        Product::factory()->doll()->create([
            'name' => 'Witch',
            'slug' => 'witch-doll',
            'sku' => 'DOLL-WITCH-001',
            'is_active' => true,
            'stock_quantity' => 10,
        ]);
        Product::factory()->doll()->create([
            'name' => 'Hat',
            'slug' => 'hat-doll',
            'sku' => 'DOLL-HAT-001',
            'is_active' => true,
            'stock_quantity' => 10,
        ]);

        Product::factory()->doll()->create([
            'name' => 'Other Doll',
            'slug' => 'other-doll',
            'sku' => 'DOLL-OTHER-001',
            'is_active' => true,
            'stock_quantity' => 10,
        ]);
        Product::factory()->simple()->create([
            'name' => 'Simple Product',
            'slug' => 'simple-product',
            'sku' => 'SIMPLE-001',
            'product_type' => ProductType::Simple->value,
            'is_active' => true,
            'stock_quantity' => 10,
        ]);

        $products = app(ConfigurableDollProductService::class)->getReadyDollProducts();

        $this->assertSame([
            'DOLL-QUEEN-001',
            'DOLL-HAT-001',
            'DOLL-BIKINI-001',
            'DOLL-WITCH-001',
        ], $products->pluck('sku')->all());

        $this->assertTrue($products->every(
            fn (Product $product): bool => $product->relationLoaded('category')
                && $product->relationLoaded('images')
        ));
    }

    public function test_get_ready_doll_products_filters_inactive_and_out_of_stock_products(): void
    {
        Product::factory()->doll()->create([
            'slug' => 'queen-doll',
            'sku' => 'DOLL-QUEEN-001',
            'is_active' => true,
            'stock_quantity' => 10,
        ]);
        Product::factory()->doll()->create([
            'slug' => 'hat-doll',
            'sku' => 'DOLL-HAT-001',
            'is_active' => false,
            'stock_quantity' => 10,
        ]);
        Product::factory()->doll()->create([
            'slug' => 'bikini-doll',
            'sku' => 'DOLL-BIKINI-001',
            'is_active' => true,
            'stock_quantity' => 0,
        ]);

        $products = app(ConfigurableDollProductService::class)->getReadyDollProducts();

        $this->assertSame(['DOLL-QUEEN-001'], $products->pluck('sku')->all());
    }
}
