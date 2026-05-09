<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_registration_screen_preserves_checkout_intent_props(): void
    {
        $this->get(route('register', ['checkout' => 1, 'buy_now' => 1]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Auth/Auth')
                ->where('view', 'register')
                ->where('checkoutIntent', true)
                ->where('checkoutBuyNow', true)
            );
    }

    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('home', absolute: false));
    }

    public function test_new_users_return_to_checkout_information_after_checkout_registration(): void
    {
        $response = $this->post('/register', [
            'name' => 'Checkout User',
            'email' => 'checkout@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'checkout_auth_intent' => true,
            'checkout_buy_now' => true,
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('cart.index', [
            'checkout_step' => 'info',
            'buy_now' => 1,
        ], absolute: false));
    }
}
