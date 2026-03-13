<?php

declare(strict_types=1);

namespace Tests\Feature\Actions;

use App\Domain\Orders\Actions\CreateOrder;
use App\Exceptions\CartEmptyException;
use App\Exceptions\InsufficientStockException;
use App\Models\Product;
use App\Models\User;
use App\Domain\Carts\Services\CartService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Session;
use Tests\TestCase;

class CreateOrderTest extends TestCase
{
    use RefreshDatabase;

    protected CreateOrder $action;

    protected CartService $cartService;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = app(CreateOrder::class);
        $this->cartService = app(CartService::class);
        $this->user = User::factory()->create();
        $this->actingAs($this->user);
        Session::start();
    }

    public function test_can_create_order(): void
    {
        $product = Product::factory()->create([
            'stock_quantity' => 10,
            'is_active' => true,
            'base_price' => 100.00,
        ]);

        $this->cartService->addToCart($product->slug, 2);

        $order = $this->action->execute([
            'shipping_address' => [
                'street_address' => 'Test Street 123',
                'city' => 'Test City',
                'postal_code' => '12345',
                'country' => 'Spain',
            ],
            'payment_method' => 'stripe',
        ]);

        $this->assertNotNull($order);
        $this->assertEquals(200.00, $order->total_amount);
        $this->assertEquals('pending', $order->status);
        $this->assertStringStartsWith('MK-', $order->order_number);
    }

    public function test_throws_exception_with_empty_cart(): void
    {
        $this->expectException(CartEmptyException::class);

        $this->action->execute([
            'shipping_address' => [
                'street_address' => 'Test Street 123',
                'city' => 'Test City',
                'postal_code' => '12345',
                'country' => 'Spain',
            ],
            'payment_method' => 'stripe',
        ]);
    }

    public function test_throws_exception_when_stock_insufficient(): void
    {
        $product = Product::factory()->create([
            'stock_quantity' => 2,
            'is_active' => true,
        ]);

        $this->cartService->addToCart($product->slug, 2);

        // Reduce stock in database
        $product->update(['stock_quantity' => 1]);

        $this->expectException(InsufficientStockException::class);

        $this->action->execute([
            'shipping_address' => [
                'street_address' => 'Test Street 123',
                'city' => 'Test City',
                'postal_code' => '12345',
                'country' => 'Spain',
            ],
            'payment_method' => 'stripe',
        ]);
    }

    public function test_clears_cart_after_order_creation(): void
    {
        $product = Product::factory()->create([
            'stock_quantity' => 10,
            'is_active' => true,
        ]);

        $this->cartService->addToCart($product->slug, 1);

        $this->action->execute([
            'shipping_address' => [
                'street_address' => 'Test Street 123',
                'city' => 'Test City',
                'postal_code' => '12345',
                'country' => 'Spain',
            ],
            'payment_method' => 'stripe',
        ]);

        $cart = $this->cartService->getCart();
        $this->assertCount(0, $cart['items']);
    }

    public function test_order_items_are_created(): void
    {
        $product = Product::factory()->create([
            'stock_quantity' => 10,
            'is_active' => true,
            'base_price' => 100.00,
            'name' => 'Test Product',
        ]);

        $this->cartService->addToCart($product->slug, 2);

        $order = $this->action->execute([
            'shipping_address' => [
                'street_address' => 'Test Street 123',
                'city' => 'Test City',
                'postal_code' => '12345',
                'country' => 'Spain',
            ],
            'payment_method' => 'stripe',
        ]);

        $this->assertCount(1, $order->items);
        $this->assertEquals('Test Product', $order->items->first()->product_name_snapshot);
        $this->assertEquals(2, $order->items->first()->quantity);
    }

    public function test_stock_is_reduced(): void
    {
        $product = Product::factory()->create([
            'stock_quantity' => 10,
            'is_active' => true,
        ]);

        $this->cartService->addToCart($product->slug, 3);

        $this->action->execute([
            'shipping_address' => [
                'street_address' => 'Test Street 123',
                'city' => 'Test City',
                'postal_code' => '12345',
                'country' => 'Spain',
            ],
            'payment_method' => 'stripe',
        ]);

        $product->refresh();
        // Stock should be reduced by 3 (from 10 to 7)
        $this->assertLessThan(10, $product->stock_quantity);
        $this->assertEquals(7, $product->stock_quantity);
    }
}
