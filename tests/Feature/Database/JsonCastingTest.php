<?php

declare(strict_types=1);

namespace Tests\Feature\Database;

use App\Domain\Dolls\Services\DollSettingsService;
use App\Models\Address;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JsonCastingTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_images_are_persisted_and_read_as_array(): void
    {
        $category = Category::factory()->create();
        $images = [
            'https://example.test/front.png',
            'https://example.test/back.png',
        ];

        $product = Product::factory()->create([
            'category_id' => $category->getKey(),
            'images' => $images,
        ]);

        $product->refresh();

        $this->assertSame($images, $product->images);
    }

    public function test_order_addresses_are_persisted_and_loaded_through_relations(): void
    {
        $user = User::factory()->create();
        $shippingAddress = Address::query()->create([
            'user_id' => $user->getKey(),
            'alias' => 'shipping',
            'full_name' => 'Cliente Test',
            'phone' => '600000000',
            'street_address' => 'Calle Mayor 1',
            'city' => 'Madrid',
            'postal_code' => '28013',
            'country' => 'España',
            'is_default' => false,
        ]);
        $billingAddress = Address::query()->create([
            'user_id' => $user->getKey(),
            'alias' => 'billing',
            'full_name' => 'Empresa Test',
            'phone' => '611111111',
            'street_address' => 'Avenida Central 2',
            'city' => 'Barcelona',
            'postal_code' => '08001',
            'country' => 'España',
            'is_default' => false,
        ]);

        $order = Order::factory()->create([
            'user_id' => $user->getKey(),
            'shipping_address_id' => $shippingAddress->getKey(),
            'billing_address_id' => $billingAddress->getKey(),
        ]);

        $order->load(['shippingAddress', 'billingAddress']);

        $this->assertSame($shippingAddress->getKey(), $order->shippingAddress?->getKey());
        $this->assertSame('España', $order->shippingAddress?->country);
        $this->assertSame($billingAddress->getKey(), $order->billingAddress?->getKey());
        $this->assertSame('Barcelona', $order->billingAddress?->city);
    }

    public function test_doll_settings_are_persisted_and_read_as_array(): void
    {
        $settings = [
            'body' => 'classic',
            'skinTone' => 'warm',
            'parts' => [
                'eyes' => 'blue',
                'hair' => 'black',
            ],
        ];

        $service = app(DollSettingsService::class);

        $this->assertTrue($service->saveSettings($settings));
        $this->assertEquals($settings, $service->getSettings());
    }
}
