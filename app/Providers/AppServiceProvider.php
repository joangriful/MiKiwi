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
use Illuminate\Database\Connection;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
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

        if (config('app.debug') && env('PERF_LOG_SLOW_QUERIES', true)) {
            DB::whenQueryingForLongerThan((int) env('PERF_SLOW_QUERY_MS', 250), function (Connection $connection, QueryExecuted $event): void {
                Log::warning('Slow query threshold reached', [
                    'connection' => $connection->getName(),
                    'threshold_ms' => (int) env('PERF_SLOW_QUERY_MS', 250),
                    'sql' => $event->sql,
                    'time_ms' => $event->time,
                ]);
            });
        }
    }
}
