<?php

declare(strict_types=1);

namespace Tests\Feature\Events;

use App\Events\OrderStatusUpdated;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderStatusUpdatedTest extends TestCase
{
    use RefreshDatabase;

    public function test_event_is_dispatched_with_correct_statuses(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        $event = new OrderStatusUpdated($order, 'pending', 'processing');

        $this->assertEquals($order->id, $event->order->id);
        $this->assertEquals('pending', $event->oldStatus);
        $this->assertEquals('processing', $event->newStatus);
    }
}
