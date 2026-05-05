<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers;

use App\Domain\Carts\Services\CartService;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PickupPoint;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Mockery;
use Mockery\ExpectationInterface;
use Stripe\Customer;
use Tests\TestCase;

class OrderControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_payment_intent_returns_structured_error_when_cart_is_empty(): void
    {
        $user = $this->createUser();

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
        $user = $this->createUser();
        $pickupPoint = PickupPoint::query()->create([
            'name' => 'Punto Centro',
            'address' => 'Calle Mayor 1',
            'city' => 'Madrid',
            'postal_code' => '28013',
            'is_active' => true,
        ]);
        $product = Product::factory()->create([
            'is_active' => true,
            'stock_quantity' => 10,
            'base_price' => 50,
        ]);

        $this->actingAs($user);
        app(CartService::class)->addToCart($product->slug, 2);

        $this->post(route('orders.store'), $this->validOrderPayload([
            'payment_intent_id' => 'pi_pending',
            'pickup_point_id' => $pickupPoint->getKey(),
        ]))
            ->assertRedirect(route('orders.success'))
            ->assertSessionHas('success', '¡Pedido realizado con éxito!');

        $order = Order::query()->firstOrFail();
        $order->load(['shippingAddress', 'billingAddress']);

        $this->assertSame($user->getKey(), $order->user_id);
        $this->assertSame(OrderStatus::Pending->value, $order->status);
        $this->assertSame(PaymentStatus::Pending->value, $order->payment_status);
        $this->assertEquals(100, $order->total_amount);
        $this->assertNotNull($order->shippingAddress);
        $this->assertSame('Test Street 123', $order->shippingAddress?->street_address);
        $this->assertNotNull($order->billingAddress);
        $this->assertSame('Test City', $order->billingAddress?->city);
        $this->assertCount(1, $order->items);
        $this->assertSame(8, $product->refresh()->stock_quantity);
        $this->assertSame([], session('shopping_cart', []));
        $this->assertSame($order->getKey(), session('last_order_id'));
    }

    public function test_success_page_receives_last_order_id_from_session(): void
    {
        $user = $this->createUser();
        $order = Order::factory()->create(['user_id' => $user->getKey()]);

        $this
            ->actingAs($user)
            ->withSession(['last_order_id' => $order->getKey()])
            ->get(route('orders.success'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Checkout/Success')
                ->where('orderId', $order->getKey())
            );
    }

    public function test_invoice_can_be_downloaded_by_order_owner(): void
    {
        $user = $this->createUser();
        $order = Order::factory()
            ->paid()
            ->has(OrderItem::factory()->count(1), 'items')
            ->create(['user_id' => $user->getKey()]);

        $this->expectPdfLoadViewForOrder($order);

        $this
            ->actingAs($user)
            ->get(route('orders.invoice', $order))
            ->assertOk()
            ->assertHeader('Content-Type', 'application/pdf');
    }

    public function test_invoice_cannot_be_downloaded_by_another_user(): void
    {
        $owner = $this->createUser();
        $otherUser = $this->createUser();
        $order = Order::factory()->create(['user_id' => $owner->getKey()]);

        $this->expectPdfLoadViewNever();

        $this
            ->actingAs($otherUser)
            ->get(route('orders.invoice', $order))
            ->assertForbidden();
    }

    public function test_create_payment_intent_only_saves_card_when_requested(): void
    {
        $user = $this->createUser();
        $product = Product::factory()->create([
            'is_active' => true,
            'stock_quantity' => 10,
            'base_price' => 50,
        ]);
        $stripeService = new class extends \App\Domain\Payments\Services\StripeService
        {
            public ?bool $saveCard = null;

            public function __construct() {}

            public function getOrCreateCustomer($user): Customer
            {
                return Customer::constructFrom(['id' => 'cus_test']);
            }

            public function createPaymentIntent($amount, $currency = 'eur', $metadata = [], $customerId = null, $saveCard = false)
            {
                $this->saveCard = $saveCard;

                return (object) ['client_secret' => 'pi_secret_test'];
            }
        };

        $this->app->instance(\App\Domain\Payments\Services\StripeService::class, $stripeService);

        $this->actingAs($user);
        app(CartService::class)->addToCart($product->slug, 1);

        $this
            ->postJson(route('payment-intent.create'), ['save_card' => true])
            ->assertOk()
            ->assertJson(['clientSecret' => 'pi_secret_test']);

        $this->assertTrue($stripeService->saveCard);

        $this
            ->postJson(route('payment-intent.create'), ['save_card' => false])
            ->assertOk()
            ->assertJson(['clientSecret' => 'pi_secret_test']);

        $this->assertFalse($stripeService->saveCard);
    }

    public function test_store_creates_order_from_buy_now_item_and_clears_buy_now_session(): void
    {
        $user = $this->createUser();
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
        $user = $this->createUser();
        $product = Product::factory()->create(['stock_quantity' => 4]);
        $order = Order::factory()->create([
            'user_id' => $user->getKey(),
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
        $user = $this->createUser();
        $product = Product::factory()->create(['stock_quantity' => 4]);
        $order = Order::factory()->shipped()->create([
            'user_id' => $user->getKey(),
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
                'full_name' => 'Test User',
                'phone' => '600123123',
                'street_address' => 'Test Street 123',
                'city' => 'Test City',
                'postal_code' => '12345',
                'country' => 'Spain',
            ],
            'payment_method' => 'stripe',
        ], $overrides);
    }

    private function expectPdfLoadViewForOrder(Order $order): void
    {
        $this->shouldReceivePdfLoadView()
            ->once()
            ->with('invoices.order', Mockery::on(fn (array $data): bool => $data['order']->is($order)))
            ->andReturn(new class
            {
                public function download(string $filename)
                {
                    return response('fake pdf', 200, [
                        'Content-Type' => 'application/pdf',
                        'Content-Disposition' => 'attachment; filename="'.$filename.'"',
                    ]);
                }
            });
    }

    private function expectPdfLoadViewNever(): void
    {
        $this->shouldReceivePdfLoadView()->never();
    }

    private function shouldReceivePdfLoadView(): mixed
    {
        $facadeClass = 'Barryvdh\\DomPDF\\Facade\\Pdf';

        if (! class_exists($facadeClass)) {
            class_alias(TestPdfFacade::class, $facadeClass);
        }

        return $facadeClass::shouldReceive('loadView');
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function createUser(array $attributes = []): User
    {
        $user = User::factory()->create($attributes);

        assert($user instanceof User);

        return $user;
    }
}

class TestPdfFacade
{
    private static ?\Mockery\MockInterface $mock = null;

    public static function shouldReceive(string $method): ExpectationInterface
    {
        self::$mock = Mockery::mock();

        return self::$mock->shouldReceive($method);
    }

    public static function __callStatic(string $method, array $arguments): mixed
    {
        return self::$mock->{$method}(...$arguments);
    }
}
