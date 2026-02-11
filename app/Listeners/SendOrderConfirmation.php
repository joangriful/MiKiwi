<?php

namespace App\Listeners;

use App\Events\OrderCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendOrderConfirmation
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
        $user = $event->order->user;
        
        // Aquí iría el envío real. Por ahora deja el comentario o un log.
        // Mail::to($user)->send(new OrderConfirmationMail($event->order));
        
        \Log::info("Enviando confirmación de pedido #{$event->order->id} a {$user->email}");
    }
}
