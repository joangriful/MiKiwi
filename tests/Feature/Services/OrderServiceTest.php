<?php

declare(strict_types=1);

namespace Tests\Feature\Services;

use App\Exceptions\CartEmptyException;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Domain\Carts\Services\CartService;
use App\Domain\Orders\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Session;
use Tests\TestCase;

class OrderServiceTest extends TestCase
{
    use RefreshDatabase;

    protected OrderService $orderService;

    protected CartService $cartService;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->orderService = app(OrderService::class);
        $this->cartService = app(CartService::class);
        $this->user = User::factory()->create();
        Session::start();
    }

    public function test_can_create_order_from_cart(): void
    {
        $product = Product::factory()->create([
            'stock_quantity' => 10,
            'is_active' => true,
            'base_price' => 100.00,
        ]);

        $this->cartService->addToCart($product->slug, 2);

        $result = $this->orderService->createOrderFromCart(
            $this->user->id,
            [
                'street_address' => 'Test Street 123',
                'city' => 'Test City',
                'postal_code' => '12345',
                'country' => 'Spain',
            ]
        );

        $this->assertTrue($result['success']);
        $this->assertNotNull($result['order']);
        $this->assertEquals(200.00, $result['order']->total_amount);
        $this->assertStringStartsWith('MK-', $result['order_number']);
    }

    public function test_cannot_create_order_with_empty_cart(): void
    {
        $this->expectException(CartEmptyException::class);

        $this->orderService->createOrderFromCart(
            $this->user->id,
            [
                'street_address' => 'Test Street 123',
                'city' => 'Test City',
                'postal_code' => '12345',
                'country' => 'Spain',
            ]
        );
    }

    public function test_order_creation_reduces_stock(): void
    {
        $product = Product::factory()->create([
            'stock_quantity' => 10,
            'is_active' => true,
            'base_price' => 100.00,
        ]);

        $this->cartService->addToCart($product->slug, 3);

        $this->orderService->createOrderFromCart(
            $this->user->id,
            [
                'street_address' => 'Test Street 123',
                'city' => 'Test City',
                'postal_code' => '12345',
                'country' => 'Spain',
            ]
        );

        $product->refresh();
        $this->assertEquals(7, $product->stock_quantity);
    }

    public function test_can_get_user_orders(): void
    {
        Order::factory()->count(3)->create(['user_id' => $this->user->id]);

        $orders = $this->orderService->getUserOrders($this->user->id);

        $this->assertCount(3, $orders);
    }

    public function test_can_get_order_details(): void
    {
        $order = Order::factory()->create(['user_id' => $this->user->id]);

        $details = $this->orderService->getOrderDetails($order->order_number);

        $this->assertEquals($order->id, $details['order']->id);
    }
}
