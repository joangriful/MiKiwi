<?php

declare(strict_types=1);

namespace Tests\Feature\Repositories;

use App\Models\Order;
use App\Models\User;
use App\Domain\Orders\Repositories\Eloquent\EloquentOrderRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EloquentOrderRepositoryTest extends TestCase
{
    use RefreshDatabase;

    protected EloquentOrderRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = new EloquentOrderRepository;
    }

    public function test_can_create_order_with_items(): void
    {
        $user = User::factory()->create();

        $data = [
            'user_id' => $user->id,
            'order_number' => 'ORD-123',
            'status' => 'pending',
            'total_amount' => 100.00,
            'shipping_address_snapshot' => [
                'street' => '123 Test St',
                'city' => 'Test City',
                'country' => 'Test Country',
            ],
            'items' => [
            ],
        ];

        $product = \App\Models\Product::factory()->create();

        $data['items'][0] = [
            'product_id' => $product->id,
            'quantity' => 2,
            'unit_price' => 50.00,
            'product_name_snapshot' => $product->name,
            'sku_snapshot' => $product->sku,
        ];

        $order = $this->repository->create($data);

        $this->assertDatabaseHas('orders', ['order_number' => 'ORD-123']);
        $this->assertCount(1, $order->items);
        $this->assertEquals($product->id, $order->items->first()->product_id);
    }

    public function test_can_find_by_order_number(): void
    {
        $order = Order::factory()->create(['order_number' => 'ORD-FIND']);

        $found = $this->repository->findByOrderNumber('ORD-FIND');

        $this->assertNotNull($found);
        $this->assertEquals($order->id, $found->id);
    }

    public function test_can_get_user_orders(): void
    {
        $user = User::factory()->create();
        Order::factory()->count(3)->create(['user_id' => $user->id]);

        $orders = $this->repository->getUserOrders((string) $user->id);

        $this->assertCount(3, $orders);
    }

    public function test_can_update_status(): void
    {
        $order = Order::factory()->create(['status' => 'pending']);

        $result = $this->repository->updateStatus((string) $order->id, 'shipped');

        $this->assertTrue($result);
        $this->assertEquals('shipped', $order->fresh()->status);
    }
}
