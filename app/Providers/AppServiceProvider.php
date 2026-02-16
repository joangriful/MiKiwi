<?php

declare(strict_types=1);

namespace App\Providers;

use App\Repositories\Eloquent\EloquentCategoryRepository;
use App\Repositories\Eloquent\EloquentHeroImageRepository;
use App\Repositories\Eloquent\EloquentOrderRepository;
use App\Repositories\Eloquent\EloquentProductRepository;
use App\Repositories\Eloquent\EloquentUserAddressRepository;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use App\Repositories\Interfaces\HeroImageRepositoryInterface;
use App\Repositories\Interfaces\OrderRepositoryInterface;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use App\Repositories\Interfaces\UserAddressRepositoryInterface;
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
