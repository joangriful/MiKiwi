<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\OrderCreated;
use Illuminate\Contracts\Queue\ShouldQueue;

class NotifyAdminOfNewOrder implements ShouldQueue
{
    public function handle(OrderCreated $event): void
    {
        $order = $event->order;

        // Aquí se notificaría a los admins
        // Podría ser email, Slack, o notificación en base de datos

        \Illuminate\Support\Facades\Log::info('Admin notified of new order', [
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'total' => $order->total_amount,
        ]);
    }
}
