<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Contracts\Provider;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;
use Laravel\Socialite\Two\User as SocialiteUser;
use Mockery;
use Tests\TestCase;

class GoogleAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_google_redirect_route_redirects_to_google_provider(): void
    {
        $provider = Mockery::mock(Provider::class);
        $provider->shouldReceive('scopes')->once()->with(['openid', 'profile', 'email'])->andReturnSelf();
        $provider->shouldReceive('with')->once()->with(['prompt' => 'select_account'])->andReturnSelf();
        $provider->shouldReceive('redirect')->once()->andReturn(redirect('https://accounts.google.com/o/oauth2/auth'));

        Socialite::shouldReceive('driver')->once()->with('google')->andReturn($provider);

        $response = $this->get(route('auth.google.redirect'));

        $response->assertRedirect('https://accounts.google.com/o/oauth2/auth');
    }

    public function test_google_redirect_stores_checkout_intent_for_social_callback(): void
    {
        $provider = Mockery::mock(Provider::class);
        $provider->shouldReceive('scopes')->once()->with(['openid', 'profile', 'email'])->andReturnSelf();
        $provider->shouldReceive('with')->once()->with(['prompt' => 'select_account'])->andReturnSelf();
        $provider->shouldReceive('redirect')->once()->andReturn(redirect('https://accounts.google.com/o/oauth2/auth'));

        Socialite::shouldReceive('driver')->once()->with('google')->andReturn($provider);

        $this->get(route('auth.google.redirect', ['checkout' => 1, 'buy_now' => 1]))
            ->assertRedirect('https://accounts.google.com/o/oauth2/auth')
            ->assertSessionHas('checkout_auth_intent', ['buy_now' => true]);
    }

    public function test_google_callback_logs_in_existing_user(): void
    {
        $existingUser = User::factory()->unverified()->create([
            'email' => 'migue@example.com',
        ]);

        $provider = $this->mockGoogleProviderWithUser($this->fakeGoogleUser([
            'id' => 'google-123',
            'name' => 'Migue Google',
            'email' => 'migue@example.com',
        ]));

        Socialite::shouldReceive('driver')->once()->with('google')->andReturn($provider);

        $response = $this->get(route('auth.google.callback'));

        $this->assertAuthenticatedAs($existingUser->fresh());
        $this->assertNotNull($existingUser->fresh()->email_verified_at);
        $response->assertRedirect(route('home', absolute: false));
    }

    public function test_google_callback_returns_to_checkout_information_when_checkout_intent_exists(): void
    {
        $existingUser = User::factory()->unverified()->create([
            'email' => 'checkout-google@example.com',
        ]);

        $provider = $this->mockGoogleProviderWithUser($this->fakeGoogleUser([
            'id' => 'google-checkout',
            'name' => 'Checkout Google',
            'email' => 'checkout-google@example.com',
        ]));

        Socialite::shouldReceive('driver')->once()->with('google')->andReturn($provider);

        $response = $this
            ->withSession(['checkout_auth_intent' => ['buy_now' => true]])
            ->get(route('auth.google.callback'));

        $this->assertAuthenticatedAs($existingUser->fresh());
        $response->assertRedirect(route('cart.index', [
            'checkout_step' => 'info',
            'buy_now' => 1,
        ], absolute: false));
        $response->assertSessionMissing('checkout_auth_intent');
    }

    public function test_google_callback_creates_and_logs_in_new_user(): void
    {
        $provider = $this->mockGoogleProviderWithUser($this->fakeGoogleUser([
            'id' => 'google-456',
            'name' => 'New Google User',
            'email' => 'New-Google-User@Example.com ',
            'avatar' => 'https://lh3.googleusercontent.com/avatar-123',
        ]));

        Socialite::shouldReceive('driver')->once()->with('google')->andReturn($provider);

        $response = $this->get(route('auth.google.callback'));

        $user = User::query()->where('email', 'new-google-user@example.com')->first();

        $this->assertNotNull($user);
        $this->assertSame('New Google User', $user->name);
        $this->assertNotSame('', $user->password);
        $this->assertNotSame('password', $user->password);
        $this->assertNotNull(password_get_info($user->password)['algo']);
        $this->assertNotNull($user->email_verified_at);
        $this->assertSame('https://lh3.googleusercontent.com/avatar-123', $user->profile_photo_url);
        $this->assertAuthenticatedAs($user);
        $response->assertRedirect(route('home', absolute: false));
    }

    public function test_google_callback_restores_soft_deleted_user_with_same_email(): void
    {
        $deletedUser = User::factory()->create([
            'email' => 'restored@example.com',
            'email_verified_at' => null,
            'profile_photo_url' => null,
        ]);

        $deletedUser->delete();

        $provider = $this->mockGoogleProviderWithUser($this->fakeGoogleUser([
            'id' => 'google-restore',
            'name' => 'Restored User',
            'email' => ' restored@example.com ',
            'avatar' => 'https://lh3.googleusercontent.com/restored-avatar',
        ]));

        Socialite::shouldReceive('driver')->once()->with('google')->andReturn($provider);

        $response = $this->get(route('auth.google.callback'));

        $restoredUser = User::query()->where('email', 'restored@example.com')->first();

        $this->assertNotNull($restoredUser);
        $this->assertSame($deletedUser->id, $restoredUser->id);
        $this->assertNull($restoredUser->deleted_at);
        $this->assertNotNull($restoredUser->email_verified_at);
        $this->assertSame('https://lh3.googleusercontent.com/restored-avatar', $restoredUser->profile_photo_url);
        $this->assertAuthenticatedAs($restoredUser);
        $response->assertRedirect(route('home', absolute: false));
    }

    public function test_google_callback_rejects_provider_without_email(): void
    {
        $provider = $this->mockGoogleProviderWithUser($this->fakeGoogleUser([
            'id' => 'google-789',
            'name' => 'No Email User',
            'email' => null,
        ]));

        Socialite::shouldReceive('driver')->once()->with('google')->andReturn($provider);

        $response = $this->from(route('login'))->get(route('auth.google.callback'));

        $this->assertGuest();
        $response->assertRedirect(route('login', absolute: false));
        $response->assertSessionHasErrors('email');
    }

    public function test_google_callback_handles_invalid_state(): void
    {
        $provider = Mockery::mock(Provider::class);
        $provider->shouldReceive('scopes')->once()->with(['openid', 'profile', 'email'])->andReturnSelf();
        $provider->shouldReceive('with')->once()->with(['prompt' => 'select_account'])->andReturnSelf();
        $provider->shouldReceive('user')->once()->andThrow(new InvalidStateException);

        Socialite::shouldReceive('driver')->once()->with('google')->andReturn($provider);

        $response = $this->from(route('login'))->get(route('auth.google.callback'));

        $this->assertGuest();
        $response->assertRedirect(route('login', absolute: false));
        $response->assertSessionHasErrors('email');
    }

    private function fakeGoogleUser(array $attributes): SocialiteUser
    {
        return (new SocialiteUser)->map($attributes);
    }

    private function mockGoogleProviderWithUser(SocialiteUser $user): Provider
    {
        $provider = Mockery::mock(Provider::class);
        $provider->shouldReceive('scopes')->once()->with(['openid', 'profile', 'email'])->andReturnSelf();
        $provider->shouldReceive('with')->once()->with(['prompt' => 'select_account'])->andReturnSelf();
        $provider->shouldReceive('user')->once()->andReturn($user);

        return $provider;
    }
}
