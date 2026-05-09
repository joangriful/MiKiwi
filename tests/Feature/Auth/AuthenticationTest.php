<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_login_screen_preserves_checkout_intent_props(): void
    {
        $this->get(route('login', ['checkout' => 1, 'buy_now' => 1]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Auth/Auth')
                ->where('view', 'login')
                ->where('checkoutIntent', true)
                ->where('checkoutBuyNow', true)
            );
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('home', absolute: false));
    }

    public function test_users_return_to_checkout_information_after_checkout_login(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
            'checkout_auth_intent' => true,
            'checkout_buy_now' => true,
        ]);

        $this->assertAuthenticatedAs($user);
        $response->assertRedirect(route('cart.index', [
            'checkout_step' => 'info',
            'buy_now' => 1,
        ], absolute: false));
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }
}
