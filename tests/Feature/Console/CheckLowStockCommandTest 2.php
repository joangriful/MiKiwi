<?php

declare(strict_types=1);

namespace Tests\Feature\Console;

use App\Events\ProductLowStock;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class CheckLowStockCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_command_identifies_low_stock_products(): void
    {
        Event::fake([ProductLowStock::class]);

        $productLow = Product::factory()->create([
            'stock_quantity' => 5,
            'is_active' => true,
        ]);

        $productHigh = Product::factory()->create([
            'stock_quantity' => 20,
            'is_active' => true,
        ]);

        $this->artisan('stock:check')
            ->expectsOutput('Verificando productos con stock menor a 10...')
            ->expectsOutput("Producto con stock bajo: {$productLow->name} (5)")
            ->expectsOutput('Se encontraron 1 productos con stock bajo.')
            ->assertSuccessful();

        Event::assertDispatched(ProductLowStock::class, function ($e) use ($productLow) {
            return $e->product->id === $productLow->id;
        });

        Event::assertNotDispatched(ProductLowStock::class, function ($e) use ($productHigh) {
            return $e->product->id === $productHigh->id;
        });
    }

    public function test_command_respects_threshold_option(): void
    {
        Event::fake([ProductLowStock::class]);

        Product::factory()->create([
            'stock_quantity' => 15,
            'is_active' => true,
        ]);

        $this->artisan('stock:check --threshold=20')
            ->expectsOutput('Verificando productos con stock menor a 20...')
            ->expectsOutput('Se encontraron 1 productos con stock bajo.')
            ->assertSuccessful();

        Event::assertDispatched(ProductLowStock::class);
    }
}
