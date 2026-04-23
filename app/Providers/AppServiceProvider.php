<?php

declare(strict_types=1);

namespace App\Providers;

use App\Domain\Categories\Repositories\Eloquent\EloquentCategoryRepository;
use App\Domain\Categories\Repositories\Interfaces\CategoryRepositoryInterface;
use App\Domain\HeroImages\Repositories\Eloquent\EloquentHeroImageRepository;
use App\Domain\Orders\Repositories\Eloquent\EloquentOrderRepository;
use App\Domain\Orders\Repositories\Interfaces\OrderRepositoryInterface;
use App\Domain\Products\Repositories\Eloquent\EloquentProductRepository;
use App\Domain\Products\Repositories\Interfaces\ProductRepositoryInterface;
use App\Domain\Addresses\Repositories\Eloquent\EloquentUserAddressRepository;
use App\Domain\Addresses\Repositories\Interfaces\UserAddressRepositoryInterface;
use App\Domain\HeroImages\Repositories\Interfaces\HeroImageRepositoryInterface;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // ... (existing register code)
        // Product Repository
        $this->app->bind(
            ProductRepositoryInterface::class,
            EloquentProductRepository::class
        );

        // Category Repository
        $this->app->bind(
            CategoryRepositoryInterface::class,
            EloquentCategoryRepository::class
        );

        // Order Repository
        $this->app->bind(
            OrderRepositoryInterface::class,
            EloquentOrderRepository::class
        );

        // UserAddress Repository
        $this->app->bind(
            UserAddressRepositoryInterface::class,
            EloquentUserAddressRepository::class
        );

        // HeroImage Repository
        $this->app->bind(
            HeroImageRepositoryInterface::class,
            EloquentHeroImageRepository::class
        );
    }

    public function boot(): void
    {
        Schema::defaultStringLength(191);
        Vite::prefetch(concurrency: 3);

        RateLimiter::for('auth-sensitive', function (Request $request): Limit {
            return Limit::perMinute(5)->by($this->authSensitiveKey($request));
        });

        RateLimiter::for('public-form', function (Request $request): Limit {
            return Limit::perMinute(5)->by($request->ip());
        });

        RateLimiter::for('cart', function (Request $request): Limit {
            return Limit::perMinute(30)->by($this->sessionOrIpKey($request));
        });

        RateLimiter::for('coupon', function (Request $request): Limit {
            return Limit::perMinute(5)->by($this->sessionOrIpKey($request));
        });

        RateLimiter::for('checkout-payment', function (Request $request): Limit {
            return Limit::perMinute(5)->by($this->userOrIpKey($request));
        });

        RateLimiter::for('profile-write', function (Request $request): Limit {
            return Limit::perMinute(10)->by($this->userOrIpKey($request));
        });

        RateLimiter::for('uploads', function (Request $request): Limit {
            return Limit::perMinute(5)->by($this->userOrIpKey($request));
        });

        RateLimiter::for('admin-write', function (Request $request): Limit {
            return Limit::perMinute(20)->by($this->userOrIpKey($request));
        });

        RateLimiter::for('external-service', function (Request $request): Limit {
            return Limit::perMinute(10)->by($this->userOrIpKey($request));
        });
    }

    private function authSensitiveKey(Request $request): string
    {
        if ($request->user()) {
            return 'user:'.$request->user()->getAuthIdentifier();
        }

        $email = Str::transliterate(Str::lower((string) $request->input('email')));

        return $email !== ''
            ? 'email:'.$email.'|ip:'.$request->ip()
            : 'ip:'.$request->ip();
    }

    private function sessionOrIpKey(Request $request): string
    {
        if ($request->hasSession()) {
            return 'session:'.$request->session()->getId();
        }

        return 'ip:'.$request->ip();
    }

    private function userOrIpKey(Request $request): string
    {
        if ($request->user()) {
            return 'user:'.$request->user()->getAuthIdentifier();
        }

        return 'ip:'.$request->ip();
    }
}
