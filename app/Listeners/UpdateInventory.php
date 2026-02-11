<?php

namespace App\Listeners;

use App\Events\OrderCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UpdateInventory
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
        // Recorremos los items del pedido y restamos stock
        foreach ($event->order->items as $item) {
            // Asumiendo que tienes una relación 'product' en el modelo OrderItem
            $item->product->decrement('stock_quantity', $item->quantity);
        }
    }
}
