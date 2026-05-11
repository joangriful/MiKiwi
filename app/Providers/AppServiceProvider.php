<?php

declare(strict_types=1);

namespace App\Providers;

use App\Domain\Addresses\Repositories\Eloquent\EloquentUserAddressRepository;
use App\Domain\Addresses\Repositories\Interfaces\UserAddressRepositoryInterface;
use App\Domain\Categories\Repositories\Eloquent\EloquentCategoryRepository;
use App\Domain\Categories\Repositories\Interfaces\CategoryRepositoryInterface;
use App\Domain\HeroImages\Repositories\Eloquent\EloquentHeroImageRepository;
use App\Domain\HeroImages\Repositories\Interfaces\HeroImageRepositoryInterface;
use App\Domain\Orders\Repositories\Eloquent\EloquentOrderRepository;
use App\Domain\Orders\Repositories\Interfaces\OrderRepositoryInterface;
use App\Domain\Products\Repositories\Eloquent\EloquentProductRepository;
use App\Domain\Products\Repositories\Interfaces\ProductRepositoryInterface;
use App\Domain\Reviews\Repositories\Eloquent\EloquentReviewRepository;
use App\Domain\Reviews\Repositories\Interfaces\ReviewRepositoryInterface;
use App\Models\Address;
use App\Models\Review;
use App\Policies\ReviewPolicy;
use App\Policies\UserAddressPolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

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

        // Review Repository
        $this->app->bind(
            ReviewRepositoryInterface::class,
            EloquentReviewRepository::class
        );
    }

    public function boot(): void
    {
        Schema::defaultStringLength(191);

        if ($this->shouldForceHttps()) {
            URL::forceScheme('https');
        }

        Vite::prefetch(concurrency: 3);
        Gate::policy(Address::class, UserAddressPolicy::class);
        Gate::policy(Review::class, ReviewPolicy::class);

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
            return Limit::perMinute(20)->by($this->sessionOrIpKey($request));
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

    private function shouldForceHttps(): bool
    {
        if ((bool) config('app.force_https')) {
            return true;
        }

        return $this->app->environment('production')
            && filled(env('RENDER_EXTERNAL_URL'));
    }
}
