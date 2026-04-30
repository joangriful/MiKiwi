<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Requests;

use App\Http\Requests\UpdateAddressRequest;
use App\Models\Address;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class UpdateAddressRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_validates_required_fields(): void
    {
        $request = new UpdateAddressRequest;

        $validator = Validator::make([], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('full_name', $validator->errors()->messages());
        $this->assertArrayHasKey('street_address', $validator->errors()->messages());
        $this->assertArrayHasKey('city', $validator->errors()->messages());
        $this->assertArrayHasKey('postal_code', $validator->errors()->messages());
        $this->assertArrayHasKey('country', $validator->errors()->messages());
    }

    public function test_authorization_check(): void
    {
        $user = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $user->id]);

        $request = new UpdateAddressRequest;

        $this->actingAs($user);

        $this->assertTrue($request->authorize());
    }
}
