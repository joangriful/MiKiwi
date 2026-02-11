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
    public function handle(OrderCreated $event): void
    {
        foreach ($event->order->items as $item) {
            // Reducimos el stock del producto
            $item->product->decrement('stock_quantity', $item->quantity);
        }

        \Illuminate\Support\Facades\Log::info("Inventario actualizado para el pedido: " . $event->order->order_number);
    }
}
