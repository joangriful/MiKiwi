<?php

declare(strict_types=1);

namespace Tests\Feature\Repositories;

use App\Models\Address;
use App\Models\User;
use App\Domain\Addresses\Repositories\Eloquent\EloquentUserAddressRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EloquentUserAddressRepositoryTest extends TestCase
{
    use RefreshDatabase;

    protected EloquentUserAddressRepository $repository;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = app(EloquentUserAddressRepository::class);
        $this->user = User::factory()->create();
    }

    public function test_can_get_user_addresses(): void
    {
        Address::factory()->count(3)->create(['user_id' => $this->user->id]);

        $addresses = $this->repository->getUserAddresses($this->user->id);

        $this->assertCount(3, $addresses);
    }

    public function test_addresses_are_ordered_by_default_first(): void
    {
        Address::factory()->create([
            'user_id' => $this->user->id,
            'is_default' => false,
        ]);
        Address::factory()->create([
            'user_id' => $this->user->id,
            'is_default' => true,
        ]);

        $addresses = $this->repository->getUserAddresses($this->user->id);

        $this->assertTrue($addresses->first()->is_default);
    }

    public function test_can_find_by_id(): void
    {
        $address = Address::factory()->create(['user_id' => $this->user->id]);

        $found = $this->repository->findById($address->id);

        $this->assertNotNull($found);
        $this->assertEquals($address->id, $found->id);
    }

    public function test_returns_null_for_nonexistent_address(): void
    {
        $found = $this->repository->findById('non-existent-id');

        $this->assertNull($found);
    }

    public function test_can_create_address(): void
    {
        $address = $this->repository->create([
            'user_id' => $this->user->id,
            'full_name' => 'John Doe',
            'street_address' => 'Test Street 123',
            'city' => 'Test City',
            'postal_code' => '12345',
            'country' => 'Spain',
        ]);

        $this->assertNotNull($address);
        $this->assertDatabaseHas('address', [
            'id' => $address->id,
            'full_name' => 'John Doe',
        ]);
    }

    public function test_can_update_address(): void
    {
        $address = Address::factory()->create([
            'user_id' => $this->user->id,
            'full_name' => 'Old Name',
        ]);

        $updated = $this->repository->update($address->id, [
            'full_name' => 'New Name',
        ]);

        $this->assertNotNull($updated);
        $this->assertEquals('New Name', $updated->full_name);
    }

    public function test_returns_null_when_updating_nonexistent_address(): void
    {
        $updated = $this->repository->update('non-existent-id', [
            'full_name' => 'New Name',
        ]);

        $this->assertNull($updated);
    }

    public function test_can_delete_address(): void
    {
        $address = Address::factory()->create(['user_id' => $this->user->id]);

        $result = $this->repository->delete($address->id);

        $this->assertTrue($result);
        $this->assertDatabaseMissing('address', ['id' => $address->id]);
    }

    public function test_returns_false_when_deleting_nonexistent_address(): void
    {
        $result = $this->repository->delete('non-existent-id');

        $this->assertFalse($result);
    }

    public function test_can_set_as_default(): void
    {
        $address1 = Address::factory()->create([
            'user_id' => $this->user->id,
            'is_default' => true,
        ]);
        $address2 = Address::factory()->create([
            'user_id' => $this->user->id,
            'is_default' => false,
        ]);

        $this->repository->setAsDefault($address2->id, $this->user->id);

        $address1->refresh();
        $address2->refresh();

        $this->assertFalse($address1->is_default);
        $this->assertTrue($address2->is_default);
    }

    public function test_can_get_default_address(): void
    {
        Address::factory()->create([
            'user_id' => $this->user->id,
            'is_default' => true,
        ]);

        $default = $this->repository->getDefaultAddress($this->user->id);

        $this->assertNotNull($default);
        $this->assertTrue($default->is_default);
    }

    public function test_can_count_user_addresses(): void
    {
        Address::factory()->count(3)->create(['user_id' => $this->user->id]);

        $count = $this->repository->countUserAddresses($this->user->id);

        $this->assertEquals(3, $count);
    }
}
