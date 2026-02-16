<?php

declare(strict_types=1);

namespace Tests\Feature\Events;

use App\Actions\Orders\CreateOrder;
use App\Events\OrderCreated;
use App\Models\Product;
use App\Models\User;
use App\Services\CartService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class OrderCreatedTest extends TestCase
{
    use RefreshDatabase;

    public function test_order_created_event_is_dispatched(): void
    {
        Event::fake([OrderCreated::class]);

        $user = User::factory()->create();
        $this->actingAs($user);

        $product = Product::factory()->create([
            'stock_quantity' => 10,
            'is_active' => true,
            'base_price' => 100.00,
        ]);

        $cartService = app(CartService::class);
        $cartService->addToCart($product->slug, 1);

        $action = app(CreateOrder::class);
        $action->execute([
            'shipping_address' => [
                'street_address' => 'Test Street',
                'city' => 'Test City',
                'postal_code' => '12345',
                'country' => 'Spain',
            ],
            'payment_method' => 'stripe',
        ]);

        Event::assertDispatched(OrderCreated::class);
    }

    public function test_event_has_order_instance(): void
    {
        $user = User::factory()->create();
        $order = \App\Models\Order::factory()->create(['user_id' => $user->id]);

        $event = new OrderCreated($order);

        $this->assertInstanceOf(\App\Models\Order::class, $event->order);
        $this->assertEquals($order->id, $event->order->id);
    }
}
