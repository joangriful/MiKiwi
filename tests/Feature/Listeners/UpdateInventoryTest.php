<?php

declare(strict_types=1);

namespace Tests\Feature\Listeners;

use App\Events\OrderCreated;
use App\Events\ProductLowStock;
use App\Listeners\UpdateInventory;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class UpdateInventoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_listener_checks_low_stock_but_does_not_decrement_stock(): void
    {
        Event::fake([ProductLowStock::class]);

        $user = User::factory()->create();

        // Start with low stock (5)
        $product = Product::factory()->create([
            'stock_quantity' => 5,
            'is_active' => true,
        ]);

        $order = Order::factory()->create(['user_id' => $user->id]);

        // Create order item (quantity 2)
        // Note: In a real scenario, Action would have reduced stock.
        // Here we test the Listener in isolation to ensure it DOES NOT reduce it again.
        $orderItem = OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'product_name_snapshot' => $product->name,
            'sku_snapshot' => $product->sku,
            'unit_price' => $product->base_price,
        ]);

        $listener = new UpdateInventory;
        $event = new OrderCreated($order);

        // Manually load the relationship to simulate real event payload
        $order->setRelation('items', collect([$orderItem]));

        $listener->handle($event);

        // Assert LowStock event was fired (5 < 10)
        Event::assertDispatched(ProductLowStock::class, function ($e) use ($product) {
            return $e->product->id === $product->id;
        });

        // Assert Stock matches original (Listener did NOT decrement)
        $this->assertEquals(5, $product->fresh()->stock_quantity);
    }

    public function test_listener_does_not_fire_low_stock_event_if_stock_sufficient(): void
    {
        Event::fake([ProductLowStock::class]);

        $user = User::factory()->create();
        $product = Product::factory()->create([
            'stock_quantity' => 20,
            'is_active' => true,
        ]);

        $order = Order::factory()->create(['user_id' => $user->id]);
        $orderItem = OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'product_name_snapshot' => $product->name,
            'sku_snapshot' => $product->sku,
            'unit_price' => $product->base_price,
        ]);

        $listener = new UpdateInventory;
        $event = new OrderCreated($order);
        $order->setRelation('items', collect([$orderItem]));

        $listener->handle($event);

        Event::assertNotDispatched(ProductLowStock::class);
    }
}
