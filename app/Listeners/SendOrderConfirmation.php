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
    public function handle(OrderCreated $event): void
    {
        // En un escenario real, aquí enviaríamos el email. 
        // Descomenta y crea el Mailable cuando estés listo:
        // \Illuminate\Support\Facades\Mail::to($event->order->user->email)
        //     ->send(new \App\Mail\OrderConfirmation($event->order));
        
        \Illuminate\Support\Facades\Log::info("Confirmación de pedido enviada para: " . $event->order->order_number);
    }
}
