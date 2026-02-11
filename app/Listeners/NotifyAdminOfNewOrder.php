<?php

namespace App\Listeners;

use App\Events\OrderCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NotifyAdminOfNewOrder
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(OrderCreated $event): void
    {
        // Notificar a los administradores (ejemplo usando un Log o Notification)
        // \Illuminate\Support\Facades\Notification::send(
        //     \App\Models\User::where('role', 'admin')->get(), 
        //     new \App\Notifications\NewOrderAdminNotification($event->order)
        // );

        \Illuminate\Support\Facades\Log::info("Administrador notificado para el pedido: " . $event->order->order_number);
    }
}
