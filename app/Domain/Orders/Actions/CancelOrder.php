<?php

declare(strict_types=1);

namespace App\Domain\Orders\Actions;

use App\Enums\OrderStatus;
use App\Events\OrderStatusUpdated;
use App\Exceptions\InvalidOrderException;
use App\Models\Order;

class CancelOrder
{
    public function execute(Order $order, string $reason = ''): Order
    {
        if (! in_array($order->status, OrderStatus::cancellableValues(), true)) {
            throw new InvalidOrderException(
                'cannot_cancel',
                $order->order_number,
                'No se puede cancelar un pedido que ya ha sido enviado o entregado.'
            );
        }

        $oldStatus = $order->status;

        $order->update([
            'status' => OrderStatus::Cancelled->value,
            'notes' => $order->notes."\n[CANCELADO]: {$reason}",
        ]);

        // Restaurar stock
        foreach ($order->items as $item) {
            if ($item->product) {
                $item->product->increment('stock_quantity', $item->quantity);
            }
        }

        event(new OrderStatusUpdated($order, $oldStatus, OrderStatus::Cancelled->value));

        return $order;
    }
}
