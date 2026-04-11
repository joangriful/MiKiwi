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
use Illuminate\Support\Facades\Schema;
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
    }
}
