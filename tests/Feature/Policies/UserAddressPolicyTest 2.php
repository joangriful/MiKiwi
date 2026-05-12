<?php

declare(strict_types=1);

namespace Tests\Feature\Policies;

use App\Models\Address;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserAddressPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_can_view_their_own_addresses(): void
    {
        $user = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($user->can('view', $address));
    }

    public function test_users_cannot_view_other_users_addresses(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $otherUser->id]);

        $this->assertFalse($user->can('view', $address));
    }

    public function test_users_can_create_addresses(): void
    {
        $user = User::factory()->create();

        $this->assertTrue($user->can('create', Address::class));
    }

    public function test_users_can_update_their_own_addresses(): void
    {
        $user = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($user->can('update', $address));
    }

    public function test_users_cannot_update_other_users_addresses(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $otherUser->id]);

        $this->assertFalse($user->can('update', $address));
    }

    public function test_users_can_delete_their_own_addresses(): void
    {
        $user = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($user->can('delete', $address));
    }

    public function test_users_cannot_delete_other_users_addresses(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $otherUser->id]);

        $this->assertFalse($user->can('delete', $address));
    }

    public function test_users_can_set_their_own_address_as_default(): void
    {
        $user = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($user->can('setDefault', $address));
    }
}
