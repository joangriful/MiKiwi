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
    public function handle(OrderCreated $event)
    {
        // Lógica para encontrar admins y notificar
        // $admins = User::where('role', 'admin')->get();
        // Notification::send($admins, new NewOrderNotification($event->order));
        
        \Log::info("Notificando administradores sobre pedido #{$event->order->id}");
    }
}
