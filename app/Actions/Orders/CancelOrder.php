<?php

declare(strict_types=1);

namespace App\Actions\Orders;

use App\Events\OrderStatusUpdated;
use App\Exceptions\InvalidOrderException;
use App\Models\Order;

class CancelOrder
{
    public function execute(Order $order, string $reason = ''): Order
    {
        if (! in_array($order->status, ['pending', 'processing'])) {
            throw new InvalidOrderException(
                'cannot_cancel',
                $order->order_number,
                'No se puede cancelar un pedido que ya ha sido enviado o entregado.'
            );
        }

        $oldStatus = $order->status;

        $order->update([
            'status' => 'cancelled',
            'notes' => $order->notes."\n[CANCELADO]: {$reason}",
        ]);

        // Restaurar stock
        foreach ($order->items as $item) {
            if ($item->product) {
                $item->product->increment('stock_quantity', $item->quantity);
            }
        }

        event(new OrderStatusUpdated($order, $oldStatus, 'cancelled'));

        return $order;
    }
}
