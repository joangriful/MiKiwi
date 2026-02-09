<?php

namespace App\Providers;

use App\Repositories\Eloquent\EloquentCategoryRepository;
use App\Repositories\Eloquent\EloquentOrderRepository;
// 1. IMPORTANTE: Añade estas líneas para importar tus clases
use App\Repositories\Eloquent\ProductRepository;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use App\Repositories\Interfaces\OrderRepositoryInterface;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // 2. Aquí hacemos la conexión (Binding)
        // "Laravel, cuando alguien pida la Interfaz, dale el Repositorio"

        // Product Repository
        $this->app->bind(
            ProductRepositoryInterface::class,
            ProductRepository::class
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
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
