<?php

declare(strict_types=1);

namespace Tests\Feature\Events;

use App\Events\ProductLowStock;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductLowStockTest extends TestCase
{
    use RefreshDatabase;

    public function test_event_contains_product_and_quantity(): void
    {
        $product = Product::factory()->create([
            'stock_quantity' => 5,
        ]);

        $event = new ProductLowStock($product, 5);

        $this->assertEquals($product->id, $event->product->id);
        $this->assertEquals(5, $event->currentStock);
    }
}
