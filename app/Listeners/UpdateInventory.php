<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\OrderCreated;
use Illuminate\Contracts\Queue\ShouldQueue;

class UpdateInventory implements ShouldQueue
{
    public function handle(OrderCreated $event): void
    {
        $order = $event->order;

        foreach ($order->items as $item) {
            $product = $item->product;
            if ($product) {
                // Stock is already decremented in CreateOrder action to ensure consistency.
                // We only need to check for low stock here.

                // Reload product to get fresh stock quantity
                $product->refresh();

                if ($product->stock_quantity < 10) {
                    event(new \App\Events\ProductLowStock($product, $product->stock_quantity));
                }
            }
        }

        \Illuminate\Support\Facades\Log::info('Inventory checked for order', [
            'order_id' => $order->id,
            'items_count' => $order->items->count(),
        ]);
    }
}
