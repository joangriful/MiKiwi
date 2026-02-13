<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Requests;

use App\Http\Requests\StoreAddressRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class StoreAddressRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_validates_required_fields(): void
    {
        $data = [
            'full_name' => '',
            'street_address' => '',
            'city' => '',
            'postal_code' => '',
            'country' => '',
        ];

        $validator = Validator::make($data, (new StoreAddressRequest)->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('full_name', $validator->errors()->toArray());
        $this->assertArrayHasKey('street_address', $validator->errors()->toArray());
        $this->assertArrayHasKey('city', $validator->errors()->toArray());
        $this->assertArrayHasKey('postal_code', $validator->errors()->toArray());
        $this->assertArrayHasKey('country', $validator->errors()->toArray());
    }

    public function test_validates_max_lengths(): void
    {
        $data = [
            'full_name' => str_repeat('a', 256),
            'street_address' => str_repeat('a', 256),
            'city' => str_repeat('a', 101),
            'postal_code' => str_repeat('a', 21),
            'country' => str_repeat('a', 101),
        ];

        $validator = Validator::make($data, (new StoreAddressRequest)->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('full_name', $validator->errors()->toArray());
        $this->assertArrayHasKey('street_address', $validator->errors()->toArray());
        $this->assertArrayHasKey('city', $validator->errors()->toArray());
        $this->assertArrayHasKey('postal_code', $validator->errors()->toArray());
        $this->assertArrayHasKey('country', $validator->errors()->toArray());
    }

    public function test_accepts_valid_data(): void
    {
        $data = [
            'full_name' => 'John Doe',
            'street_address' => 'Test Street 123',
            'city' => 'Test City',
            'postal_code' => '12345',
            'country' => 'Spain',
            'is_default' => true,
        ];

        $validator = Validator::make($data, (new StoreAddressRequest)->rules());

        $this->assertTrue($validator->passes());
    }

    public function test_alias_is_optional(): void
    {
        $data = [
            'full_name' => 'John Doe',
            'street_address' => 'Test Street 123',
            'city' => 'Test City',
            'postal_code' => '12345',
            'country' => 'Spain',
        ];

        $validator = Validator::make($data, (new StoreAddressRequest)->rules());

        $this->assertTrue($validator->passes());
    }

    public function test_error_messages_are_in_spanish(): void
    {
        $request = new StoreAddressRequest;
        $messages = $request->messages();

        $this->assertArrayHasKey('full_name.required', $messages);
        $this->assertStringContainsString('obligatorio', $messages['full_name.required']);
    }
}
