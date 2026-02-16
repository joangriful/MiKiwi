<?php

declare(strict_types=1);

namespace Tests\Feature\Actions;

use App\Actions\Orders\CancelOrder;
use App\Exceptions\InvalidOrderException;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CancelOrderTest extends TestCase
{
    use RefreshDatabase;

    protected CancelOrder $action;

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = app(CancelOrder::class);
    }

    public function test_can_cancel_pending_order(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'pending',
        ]);

        $cancelled = $this->action->execute($order, 'Customer request');

        $this->assertEquals('cancelled', $cancelled->status);
        $this->assertStringContainsString('Customer request', $cancelled->notes);
    }

    public function test_cannot_cancel_shipped_order(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'shipped',
        ]);

        $this->expectException(InvalidOrderException::class);

        $this->action->execute($order, 'Customer request');
    }

    public function test_cannot_cancel_delivered_order(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'delivered',
        ]);

        $this->expectException(InvalidOrderException::class);

        $this->action->execute($order, 'Customer request');
    }

    public function test_stock_is_restored_on_cancellation(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock_quantity' => 10]);
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'pending',
        ]);
        OrderItem::factory()->forProduct($product)->create([
            'order_id' => $order->id,
            'quantity' => 3,
        ]);

        $this->action->execute($order, 'Customer request');

        $product->refresh();
        $this->assertEquals(13, $product->stock_quantity);
    }
}
