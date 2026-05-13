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
use Illuminate\Console\Events\CommandStarting;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
use RuntimeException;

class EventServiceProvider extends ServiceProvider
{
    private const BLOCKED_COMMANDS = [
        'migrate:fresh',
        'migrate:install',
        'migrate:refresh',
        'migrate:reset',
        'migrate:rollback',
        'db:wipe',
    ];

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
        Event::listen(CommandStarting::class, static function (CommandStarting $event): void {
            if (app()->runningUnitTests() || app()->environment('testing')) {
                return;
            }

            if (in_array($event->command, self::BLOCKED_COMMANDS, true)) {
                throw new RuntimeException(
                    "El comando '{$event->command}' está bloqueado para proteger la base de datos."
                );
            }
        });
    }

    public function shouldDiscoverEvents(): bool
    {
        return true;
    }
}
