<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Requests;

use App\Http\Requests\StoreOrderRequest;
use App\Models\Address;
use App\Models\PickupPoint;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class StoreOrderRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_validates_required_fields(): void
    {
        $request = new StoreOrderRequest;

        $validator = Validator::make([], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('shipping_address', $validator->errors()->messages());
        $this->assertArrayHasKey('payment_method', $validator->errors()->messages());
    }

    public function test_validates_nested_address_fields(): void
    {
        $request = new StoreOrderRequest;

        $data = [
            'shipping_address' => [], // Empty array
            'payment_method' => 'stripe',
        ];

        $validator = Validator::make($data, $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('shipping_address.street_address', $validator->errors()->messages());
        $this->assertArrayHasKey('shipping_address.city', $validator->errors()->messages());
        $this->assertArrayHasKey('shipping_address.postal_code', $validator->errors()->messages());
        $this->assertArrayHasKey('shipping_address.country', $validator->errors()->messages());
    }

    public function test_accepts_valid_data(): void
    {
        $request = new StoreOrderRequest;

        $data = [
            'shipping_address' => [
                'street_address' => 'Test Street 123',
                'city' => 'Test City',
                'postal_code' => '12345',
                'country' => 'Spain',
            ],
            'payment_method' => 'stripe',
            'notes' => 'Test note',
        ];

        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->fails());
    }

    public function test_accepts_valid_pickup_point_identifier(): void
    {
        $request = new StoreOrderRequest;
        $pickupPoint = PickupPoint::query()->create([
            'name' => 'Punto Centro',
            'address' => 'Calle Mayor 1',
            'city' => 'Madrid',
            'postal_code' => '28013',
            'is_active' => true,
        ]);

        $data = [
            'shipping_address' => [
                'street_address' => 'Test Street 123',
                'city' => 'Test City',
                'postal_code' => '12345',
                'country' => 'Spain',
            ],
            'payment_method' => 'pickup',
            'pickup_point_id' => $pickupPoint->getKey(),
        ];

        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->fails());
    }

    public function test_accepts_missing_billing_address(): void
    {
        $request = new StoreOrderRequest;

        $data = [
            'shipping_address' => [
                'street_address' => 'Test Street 123',
                'city' => 'Test City',
                'postal_code' => '12345',
                'country' => 'Spain',
            ],
            'payment_method' => 'stripe',
        ];

        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->fails());
        $this->assertArrayNotHasKey('billing_address.street_address', $validator->errors()->messages());
    }

    public function test_rejects_shipping_address_id_from_another_user(): void
    {
        $request = new StoreOrderRequest;
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $address = Address::query()->create([
            'user_id' => $owner->getKey(),
            'alias' => 'shipping',
            'full_name' => 'Owner User',
            'phone' => '600123123',
            'street_address' => 'Owner Street 1',
            'city' => 'Madrid',
            'postal_code' => '28013',
            'country' => 'Spain',
            'is_default' => false,
        ]);

        $this->actingAs($intruder);

        $data = [
            'shipping_address' => [
                'id' => $address->getKey(),
            ],
            'payment_method' => 'stripe',
        ];

        $validator = Validator::make($data, $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('shipping_address.id', $validator->errors()->messages());
    }

    public function test_validates_payment_method_enum(): void
    {
        $request = new StoreOrderRequest;

        $data = [
            'shipping_address' => [
                'street_address' => 'Test Street 123',
                'city' => 'Test City',
                'postal_code' => '12345',
                'country' => 'Spain',
            ],
            'payment_method' => 'invalid_method',
        ];

        $validator = Validator::make($data, $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('payment_method', $validator->errors()->messages());
    }

    public function test_authorization_check(): void
    {
        $request = new StoreOrderRequest;

        // Mock Auth check if possible, but testing authorize() directly is simpler
        // Since authorize() relies on Facade Auth::check(), we can mock user login

        $this->assertFalse($request->authorize()); // Should fail for guest

        $user = User::factory()->create();
        $this->actingAs($user);

        $this->assertTrue($request->authorize());
    }
}
