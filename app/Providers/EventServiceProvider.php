<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        \App\Events\OrderCreated::class => [
            \App\Listeners\UpdateInventory::class,
            \App\Listeners\SendOrderConfirmation::class,
            \App\Listeners\NotifyAdminOfNewOrder::class,
        ],
        \App\Events\OrderStatusUpdated::class => [
            // Listeners futuros aquí
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        parent::boot();
    }
}
