<?php

declare(strict_types=1);

namespace Tests\Feature\Jobs;

use App\Jobs\ProcessPayment;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class ProcessPaymentTest extends TestCase
{
    use RefreshDatabase;

    public function test_job_can_be_dispatched(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        $job = new ProcessPayment($order, 'stripe', ['token' => 'tok_visa']);

        Log::shouldReceive('info')
            ->once()
            ->withArgs(function ($message, $context) use ($order) {
                return $message === 'Payment processed' &&
                       $context['order_id'] === $order->id;
            });

        $job->handle();
    }
}
