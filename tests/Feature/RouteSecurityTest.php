<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class RouteSecurityTest extends TestCase
{
    #[DataProvider('authenticatedRouteNames')]
    public function test_sensitive_routes_require_authentication(string $routeName): void
    {
        $middleware = $this->gatheredRouteMiddleware($routeName);

        $this->assertTrue(
            $this->hasAuthMiddleware($middleware),
            "Route [{$routeName}] must require authentication."
        );
    }

    #[DataProvider('adminRouteNames')]
    public function test_admin_routes_require_admin_middleware(string $routeName): void
    {
        $middleware = $this->gatheredRouteMiddleware($routeName);

        $this->assertTrue(
            $this->hasAuthMiddleware($middleware),
            "Route [{$routeName}] must require authentication."
        );
        $this->assertTrue(
            $this->hasAdminMiddleware($middleware),
            "Route [{$routeName}] must require admin middleware."
        );
    }

    public function test_doll_config_test_is_not_public(): void
    {
        $this->get(route('doll.config.test'))
            ->assertRedirect(route('login'));
    }

    public function test_regular_users_cannot_access_doll_config_test(): void
    {
        $user = new User(['role' => UserRole::Customer->value]);

        $this->actingAs($user)
            ->get(route('doll.config.test'))
            ->assertRedirect(route('dashboard'));
    }

    public static function authenticatedRouteNames(): array
    {
        return [
            ['dashboard'],
            ['orders.create'],
            ['orders.store'],
            ['orders.success'],
            ['orders.index'],
            ['orders.show'],
            ['orders.cancel'],
            ['pickup-points.index'],
            ['payment-intent.create'],
            ['payment-methods.index'],
            ['payment-methods.setup-intent'],
            ['payment-methods.destroy'],
            ['profile.edit'],
            ['profile.update'],
            ['profile.destroy'],
            ['profile.image.update'],
            ['profile.banner.update'],
            ['profile.quiz.save'],
            ['perfil.view'],
            ['profile.addresses.index'],
            ['profile.addresses.store'],
            ['profile.addresses.update'],
            ['profile.addresses.destroy'],
        ];
    }

    public static function adminRouteNames(): array
    {
        return [
            ['components.manager'],
            ['doll.settings.save'],
            ['doll.settings.positions'],
            ['doll.settings.savePosition'],
            ['users.toggleRole'],
            ['content.hero.upload'],
            ['content.hero.delete'],
            ['content.collections.upload'],
            ['products.cloudinary-images'],
            ['products.link-folder'],
            ['products.upload-images'],
            ['products.upload'],
            ['products.update'],
            ['products.delete'],
            ['doll.config.test'],
        ];
    }

    private function gatheredRouteMiddleware(string $routeName): array
    {
        $route = Route::getRoutes()->getByName($routeName);

        $this->assertNotNull($route, "Route [{$routeName}] must exist.");

        return $route->gatherMiddleware();
    }

    private function hasAuthMiddleware(array $middleware): bool
    {
        return in_array('auth', $middleware, true)
            || in_array(\Illuminate\Auth\Middleware\Authenticate::class, $middleware, true);
    }

    private function hasAdminMiddleware(array $middleware): bool
    {
        return in_array('admin', $middleware, true)
            || in_array(\App\Http\Middleware\EnsureUserIsAdmin::class, $middleware, true);
    }
}
