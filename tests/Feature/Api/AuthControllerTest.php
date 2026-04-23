<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_receive_sanctum_token(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'API Customer',
            'email' => 'api-customer@example.com',
            'password' => 'password-secret',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('message', 'Usuario registrado exitosamente')
            ->assertJsonPath('token_type', 'Bearer')
            ->assertJsonMissingPath('user.password')
            ->assertJsonStructure([
                'access_token',
                'user' => ['id', 'name', 'email'],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'api-customer@example.com',
            'dni' => 'N/A',
        ]);

        $this->assertSame(1, PersonalAccessToken::query()->count());
    }

    public function test_register_validates_required_and_unique_fields(): void
    {
        User::factory()->create(['email' => 'taken@example.com']);

        $this->postJson('/api/register', [
            'name' => '',
            'email' => 'taken@example.com',
            'password' => 'short',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_user_can_login_and_receive_sanctum_token(): void
    {
        User::factory()->create([
            'email' => 'login@example.com',
            'password' => Hash::make('valid-password'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'login@example.com',
            'password' => 'valid-password',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('message', 'Login correcto')
            ->assertJsonPath('token_type', 'Bearer')
            ->assertJsonMissingPath('user.password')
            ->assertJsonStructure(['access_token']);

        $this->assertSame(1, PersonalAccessToken::query()->count());
    }

    public function test_login_rejects_invalid_credentials_without_creating_token(): void
    {
        User::factory()->create([
            'email' => 'login@example.com',
            'password' => Hash::make('valid-password'),
        ]);

        $this->postJson('/api/login', [
            'email' => 'login@example.com',
            'password' => 'wrong-password',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);

        $this->assertSame(0, PersonalAccessToken::query()->count());
    }

    public function test_authenticated_user_can_logout_current_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/logout')
            ->assertOk()
            ->assertJson(['message' => 'Sesión cerrada correctamente']);

        $this->assertSame(0, PersonalAccessToken::query()->count());
    }

    public function test_logout_requires_sanctum_token(): void
    {
        $this->postJson('/api/logout')->assertUnauthorized();
    }
}
