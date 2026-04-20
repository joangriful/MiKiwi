<?php

declare(strict_types=1);

namespace Tests\Feature\Listeners;

use App\Events\OrderCreated;
use App\Listeners\NotifyAdminOfNewOrder;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class NotifyAdminOfNewOrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_listener_logs_admin_notification(): void
    {
        Log::shouldReceive('info')
            ->once()
            ->withArgs(function ($message, $context) {
                return $message === 'Admin notified of new order' &&
                       isset($context['order_id']);
            });

        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        $listener = new NotifyAdminOfNewOrder;
        $event = new OrderCreated($order);

        $listener->handle($event);
    }
}
