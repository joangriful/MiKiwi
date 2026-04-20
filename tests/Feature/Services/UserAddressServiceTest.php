<?php

declare(strict_types=1);

namespace Tests\Feature\Services;

use App\Models\User;
use App\Models\UserAddress;
use App\Domain\Addresses\Services\UserAddressService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserAddressServiceTest extends TestCase
{
    use RefreshDatabase;

    protected UserAddressService $addressService;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->addressService = app(UserAddressService::class);
        $this->user = User::factory()->create();
    }

    public function test_can_create_address(): void
    {
        $address = $this->addressService->createAddress($this->user->id, [
            'full_name' => 'John Doe',
            'street_address' => 'Test Street 123',
            'city' => 'Test City',
            'postal_code' => '12345',
            'country' => 'Spain',
        ]);

        $this->assertNotNull($address);
        $this->assertEquals($this->user->id, $address->user_id);
        $this->assertTrue($address->is_default); // First address should be default
    }

    public function test_first_address_is_set_as_default(): void
    {
        $address = $this->addressService->createAddress($this->user->id, [
            'full_name' => 'John Doe',
            'street_address' => 'Test Street 123',
            'city' => 'Test City',
            'postal_code' => '12345',
            'country' => 'Spain',
        ]);

        $this->assertTrue($address->is_default);
    }

    public function test_can_update_address(): void
    {
        $address = UserAddress::factory()->create([
            'user_id' => $this->user->id,
            'full_name' => 'Old Name',
        ]);

        $updated = $this->addressService->updateAddress($address->id, $this->user->id, [
            'full_name' => 'New Name',
        ]);

        $this->assertNotNull($updated);
        $this->assertEquals('New Name', $updated->full_name);
    }

    public function test_cannot_update_other_users_address(): void
    {
        $otherUser = User::factory()->create();
        $address = UserAddress::factory()->create([
            'user_id' => $otherUser->id,
        ]);

        $updated = $this->addressService->updateAddress($address->id, $this->user->id, [
            'full_name' => 'New Name',
        ]);

        $this->assertNull($updated);
    }

    public function test_can_delete_address(): void
    {
        $address = UserAddress::factory()->create([
            'user_id' => $this->user->id,
        ]);

        $result = $this->addressService->deleteAddress($address->id, $this->user->id);

        $this->assertTrue($result);
        $this->assertDatabaseMissing('user_addresses', ['id' => $address->id]);
    }

    public function test_cannot_delete_other_users_address(): void
    {
        $otherUser = User::factory()->create();
        $address = UserAddress::factory()->create([
            'user_id' => $otherUser->id,
        ]);

        $result = $this->addressService->deleteAddress($address->id, $this->user->id);

        $this->assertFalse($result);
    }

    public function test_can_get_default_address(): void
    {
        UserAddress::factory()->create([
            'user_id' => $this->user->id,
            'is_default' => true,
        ]);

        $default = $this->addressService->getDefaultAddress($this->user->id);

        $this->assertNotNull($default);
        $this->assertTrue($default->is_default);
    }

    public function test_can_count_user_addresses(): void
    {
        UserAddress::factory()->count(3)->create([
            'user_id' => $this->user->id,
        ]);

        $count = $this->addressService->validateMaxAddresses($this->user->id, 5);

        $this->assertTrue($count);
    }
}
