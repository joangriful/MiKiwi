<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers;

use App\Domain\Carts\Services\CartService;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_payment_intent_returns_structured_error_when_cart_is_empty(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson(route('payment-intent.create'))
            ->assertStatus(422)
            ->assertJsonStructure(['success', 'code', 'message'])
            ->assertJson([
                'success' => false,
                'code' => 'checkout_cart_empty',
                'message' => 'Tu carrito está vacío. Añade al menos un producto antes de continuar con el pago.',
            ]);
    }

    public function test_store_creates_order_from_cart_and_clears_cart(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'is_active' => true,
            'stock_quantity' => 10,
            'base_price' => 50,
        ]);

        $this->actingAs($user);
        app(CartService::class)->addToCart($product->slug, 2);

        $this->post(route('orders.store'), $this->validOrderPayload([
            'payment_intent_id' => 'pi_pending',
            'pickup_point_id' => 'mock-pickup-1',
        ]))
            ->assertRedirect(route('orders.success'))
            ->assertSessionHas('success', '¡Pedido realizado con éxito!');

        $order = Order::query()->firstOrFail();

        $this->assertSame($user->id, $order->user_id);
        $this->assertSame(OrderStatus::Pending->value, $order->status);
        $this->assertSame(PaymentStatus::Pending->value, $order->payment_status);
        $this->assertEquals(100, $order->total_amount);
        $this->assertSame('pi_pending', $order->shipping_address_snapshot['metadata']['payment_id']);
        $this->assertSame('mock-pickup-1', $order->shipping_address_snapshot['metadata']['pickup_point_id']);
        $this->assertCount(1, $order->items);
        $this->assertSame(8, $product->refresh()->stock_quantity);
        $this->assertSame([], session('shopping_cart', []));
    }

    public function test_store_creates_order_from_buy_now_item_and_clears_buy_now_session(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'is_active' => true,
            'stock_quantity' => 5,
            'base_price' => 75,
        ]);

        $this
            ->actingAs($user)
            ->withSession([
                'buy_now_item' => [
                    'slug' => $product->slug,
                    'quantity' => 1,
                    'accessories' => [],
                ],
            ])
            ->post(route('orders.store'), $this->validOrderPayload())
            ->assertRedirect(route('orders.success'));

        $order = Order::query()->firstOrFail();

        $this->assertEquals(75, $order->total_amount);
        $this->assertSame(4, $product->refresh()->stock_quantity);
        $this->assertFalse(session()->has('buy_now_item'));
    }

    public function test_cancel_pending_order_restores_stock(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock_quantity' => 4]);
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => OrderStatus::Pending->value,
        ]);
        OrderItem::factory()->forOrder($order)->forProduct($product)->create([
            'quantity' => 2,
        ]);

        $this->actingAs($user)
            ->patch(route('orders.cancel', $order), ['reason' => 'Customer request'])
            ->assertRedirect()
            ->assertSessionHas('success', 'Pedido cancelado correctamente.');

        $this->assertSame(OrderStatus::Cancelled->value, $order->refresh()->status);
        $this->assertSame(6, $product->refresh()->stock_quantity);
    }

    public function test_cancel_non_cancellable_order_returns_error_without_changing_stock(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock_quantity' => 4]);
        $order = Order::factory()->shipped()->create([
            'user_id' => $user->id,
        ]);
        OrderItem::factory()->forOrder($order)->forProduct($product)->create([
            'quantity' => 2,
        ]);

        $this->actingAs($user)
            ->patch(route('orders.cancel', $order))
            ->assertRedirect()
            ->assertSessionHas('error', 'Este pedido no puede cancelarse.');

        $this->assertSame(OrderStatus::Shipped->value, $order->refresh()->status);
        $this->assertSame(4, $product->refresh()->stock_quantity);
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function validOrderPayload(array $overrides = []): array
    {
        return array_merge([
            'shipping_address' => [
                'street_address' => 'Test Street 123',
                'city' => 'Test City',
                'postal_code' => '12345',
                'country' => 'Spain',
            ],
            'payment_method' => 'stripe',
        ], $overrides);
    }
}
