<?php

declare(strict_types=1);

namespace Tests\Feature\Actions;

use App\Domain\Orders\Actions\CreateOrder;
use App\Enums\ProductType;
use App\Exceptions\CartEmptyException;
use App\Exceptions\InsufficientStockException;
use App\Models\DollProductAccessory;
use App\Models\Product;
use App\Models\ProductImage;
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

    public function test_can_create_order_for_base_doll_with_valid_accessories(): void
    {
        [$baseDoll, $eyeAccessory] = $this->createConfigurableDollFixture();

        $this->cartService->addToCart($baseDoll->slug, 2, [], $this->configurationFor($eyeAccessory));

        $order = $this->action->execute([
            'shipping_address' => [
                'street_address' => 'Test Street 123',
                'city' => 'Test City',
                'postal_code' => '12345',
                'country' => 'Spain',
            ],
            'payment_method' => 'stripe',
        ]);

        $orderItem = $order->items->first();
        $orderAccessory = $orderItem->accessories->first();

        $this->assertSame($baseDoll->id, $orderItem->product_id);
        $this->assertSame('Muñeca personalizada', $orderItem->product_name_snapshot);
        $this->assertSame('DOLL-BASE-001', $orderItem->sku_snapshot);
        $this->assertIsArray($orderItem->configuration_snapshot);
        $this->assertSame($eyeAccessory->id, $orderAccessory->product_id);
        $this->assertSame($eyeAccessory->name, $orderAccessory->product_name_snapshot);
        $this->assertSame($eyeAccessory->sku, $orderAccessory->sku_snapshot);
        $this->assertSame('ojos', $orderAccessory->category);
        $this->assertSame('front', $orderAccessory->view);
        $this->assertSame(2, $orderAccessory->quantity);
        $this->assertSame(3, $baseDoll->refresh()->stock_quantity);
        $this->assertSame(8, $eyeAccessory->refresh()->stock_quantity);
    }

    public function test_rejects_accessory_that_does_not_belong_to_base_doll(): void
    {
        [$baseDoll, $eyeAccessory] = $this->createConfigurableDollFixture(linkAccessory: false);

        $this->expectException(\InvalidArgumentException::class);

        $this->cartService->addToCart($baseDoll->slug, 1, [], $this->configurationFor($eyeAccessory));
    }

    public function test_rejects_configurable_doll_when_accessory_has_no_stock(): void
    {
        [$baseDoll, $eyeAccessory] = $this->createConfigurableDollFixture(accessoryStock: 0);

        $this->expectException(\InvalidArgumentException::class);

        $this->cartService->addToCart($baseDoll->slug, 1, [], $this->configurationFor($eyeAccessory));
    }

    public function test_rejects_configurable_doll_when_required_category_is_missing(): void
    {
        [$baseDoll, $eyeAccessory] = $this->createConfigurableDollFixture();
        $mouthAccessory = $this->createAccessory('mouth-accessory', 'DOLL-ACC-MOUTH-001', '/images/doll_parts_ps/front/boca/boca1.png');

        DollProductAccessory::query()->create([
            'doll_product_id' => $baseDoll->id,
            'accessory_product_id' => $mouthAccessory->id,
            'group_name' => 'boca',
            'is_mandatory' => true,
        ]);

        $this->expectException(\InvalidArgumentException::class);

        $this->cartService->addToCart($baseDoll->slug, 1, [], $this->configurationFor($eyeAccessory));
    }

    /**
     * @return array{0: Product, 1: Product}
     */
    private function createConfigurableDollFixture(int $accessoryStock = 10, bool $linkAccessory = true): array
    {
        $baseDoll = Product::factory()->doll()->create([
            'name' => 'base_doll',
            'slug' => 'base-doll',
            'sku' => 'DOLL-BASE-001',
            'is_active' => true,
            'stock_quantity' => 5,
            'base_price' => 3000,
        ]);

        $eyeAccessory = $this->createAccessory(
            'eye-accessory',
            'DOLL-ACC-EYE-001',
            '/images/doll_parts_ps/front/ojos/ojos1.png',
            $accessoryStock,
        );

        if ($linkAccessory) {
            DollProductAccessory::query()->create([
                'doll_product_id' => $baseDoll->id,
                'accessory_product_id' => $eyeAccessory->id,
                'group_name' => 'ojos',
                'is_mandatory' => true,
            ]);
        }

        return [$baseDoll, $eyeAccessory];
    }

    private function createAccessory(string $slug, string $sku, string $imageUrl, int $stock = 10): Product
    {
        $accessory = Product::factory()->create([
            'name' => 'Ojos opción 1 (frontal)',
            'slug' => $slug,
            'sku' => $sku,
            'is_active' => true,
            'stock_quantity' => $stock,
            'base_price' => 40,
            'product_type' => ProductType::Accessory->value,
        ]);

        ProductImage::query()->create([
            'product_id' => $accessory->id,
            'public_id' => 'test-'.$sku,
            'image_url' => $imageUrl,
            'alt_text' => $accessory->name,
            'sort_order' => 0,
        ]);

        return $accessory;
    }

    private function configurationFor(Product $accessory): array
    {
        $imageUrl = $accessory->images()->firstOrFail()->image_url;

        return [
            'selected_accessories' => [
                'front' => [
                    'ojos' => [
                        'id' => 'ojos1',
                        'product_id' => $accessory->id,
                        'sku' => $accessory->sku,
                        'path' => $imageUrl,
                        'visual_data' => [
                            'path' => $imageUrl,
                            'layers' => [],
                        ],
                    ],
                ],
            ],
        ];
    }
}
