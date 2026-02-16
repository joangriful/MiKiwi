<?php

declare(strict_types=1);

namespace Tests\Feature\Listeners;

use App\Events\OrderCreated;
use App\Listeners\SendOrderConfirmation;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class SendOrderConfirmationTest extends TestCase
{
    use RefreshDatabase;

    public function test_listener_sends_confirmation_log(): void
    {
        Log::shouldReceive('info')
            ->once()
            ->withArgs(function ($message, $context) {
                return str_contains($message, 'Order confirmation email sent') &&
                       isset($context['order_id']);
            });

        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        $listener = new SendOrderConfirmation;
        $event = new OrderCreated($order);

        $listener->handle($event);
    }
}
