<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\OrderCreated;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendOrderConfirmation implements ShouldQueue
{
    public function handle(OrderCreated $event): void
    {
        $order = $event->order;

        // Aquí se enviaría el email de confirmación
        // Mail::to($order->user->email)->send(new OrderConfirmationMail($order));

        \Illuminate\Support\Facades\Log::info('Order confirmation email sent', [
            'order_id' => $order->id,
            'order_number' => $order->order_number,
        ]);
    }
}
