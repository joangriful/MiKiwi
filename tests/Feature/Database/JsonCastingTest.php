<?php

declare(strict_types=1);

namespace Tests\Feature\Database;

use App\Domain\Dolls\Services\DollSettingsService;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
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

    public function test_order_address_snapshots_are_persisted_and_read_as_arrays(): void
    {
        $shippingAddress = [
            'full_name' => 'Cliente Test',
            'street_address' => 'Calle Mayor 1',
            'city' => 'Madrid',
            'postal_code' => '28013',
            'country' => 'España',
        ];

        $billingAddress = [
            'full_name' => 'Empresa Test',
            'street_address' => 'Avenida Central 2',
            'city' => 'Barcelona',
            'postal_code' => '08001',
            'country' => 'España',
        ];

        $order = Order::factory()->create([
            'shipping_address_snapshot' => $shippingAddress,
            'billing_address_snapshot' => $billingAddress,
        ]);

        $order->refresh();

        $this->assertEquals($shippingAddress, $order->shipping_address_snapshot);
        $this->assertEquals($billingAddress, $order->billing_address_snapshot);
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
