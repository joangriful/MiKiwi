<?php

namespace Tests\Feature;

use App\Models\Address;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileAddressRouteTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_addresses_page_renders_existing_inertia_page(): void
    {
        /** @var User $user */
        $user = User::factory()->create();
        Address::factory()->create([
            'user_id' => $user->getKey(),
            'alias' => 'Casa',
        ]);

        $response = $this
            ->actingAs($user)
            ->get(route('profile.addresses.index'));

        $response
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Profile/Index')
                ->has('addresses', 1)
                ->where('addresses.0.alias', 'Casa')
            );
    }
}
