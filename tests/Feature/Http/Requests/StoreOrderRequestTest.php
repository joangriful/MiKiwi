<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Requests;

use App\Http\Requests\StoreOrderRequest;
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
