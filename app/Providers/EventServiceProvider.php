<?php

declare(strict_types=1);

namespace App\Providers;

use App\Events\OrderCreated;
use App\Events\OrderStatusUpdated;
use App\Events\ProductLowStock;
use App\Events\UserRegistered;
use App\Listeners\NotifyAdminOfNewOrder;
use App\Listeners\SendOrderConfirmation;
use App\Listeners\UpdateInventory;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        OrderCreated::class => [
            SendOrderConfirmation::class,
            UpdateInventory::class,
            NotifyAdminOfNewOrder::class,
        ],
        OrderStatusUpdated::class => [],
        ProductLowStock::class => [],
        UserRegistered::class => [],
    ];

    public function boot(): void
    {
        //
    }

    public function shouldDiscoverEvents(): bool
    {
        return true;
    }
}
