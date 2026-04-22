<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PickupPointFallbackTest extends TestCase
{
    use RefreshDatabase;

    public function test_testing_environment_allows_mock_pickup_points_without_flag(): void
    {
        config([
            'services.correos.client_id' => null,
            'services.correos.client_secret' => null,
            'services.correos.allow_mock_fallback' => false,
        ]);

        $response = $this
            ->actingAs($this->createUser())
            ->getJson(route('pickup-points.index', ['postal_code' => '28013']));

        $response
            ->assertOk()
            ->assertJsonFragment([
                'id' => 'mock-mad-1',
                'city' => 'MADRID',
            ]);
    }

    public function test_production_environment_does_not_use_mock_without_explicit_flag(): void
    {
        $this->useProductionEnvironment();

        config([
            'services.correos.client_id' => null,
            'services.correos.client_secret' => null,
            'services.correos.allow_mock_fallback' => false,
        ]);

        $response = $this
            ->actingAs($this->createUser())
            ->getJson(route('pickup-points.index', ['postal_code' => '28013']));

        $response
            ->assertOk()
            ->assertExactJson([]);
    }

    public function test_production_environment_allows_mock_with_explicit_flag(): void
    {
        $this->useProductionEnvironment();

        config([
            'services.correos.client_id' => null,
            'services.correos.client_secret' => null,
            'services.correos.allow_mock_fallback' => true,
        ]);

        $response = $this
            ->actingAs($this->createUser())
            ->getJson(route('pickup-points.index', ['postal_code' => '28013']));

        $response
            ->assertOk()
            ->assertJsonFragment([
                'id' => 'mock-mad-1',
                'city' => 'MADRID',
            ]);
    }

    private function createUser(): User
    {
        $user = User::factory()->create();
        $this->assertInstanceOf(User::class, $user);

        return $user;
    }

    private function useProductionEnvironment(): void
    {
        $this->app->detectEnvironment(fn () => 'production');
        config(['app.env' => 'production']);
    }
}
