<?php

namespace App\Domain\Orders\Repositories\Eloquent;

use App\Domain\Orders\Repositories\Interfaces\OrderRepositoryInterface;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class EloquentOrderRepository implements OrderRepositoryInterface
{
    /**
     * Crear un nuevo pedido
     */
    public function create(array $data): Order
    {
        return DB::transaction(function () use ($data) {
            // Crear el pedido
            $order = Order::create([
                'user_id' => $data['user_id'],
                'shipping_address_id' => $data['shipping_address_id'],
                'billing_address_id' => $data['billing_address_id'],
                'coupon_id' => $data['coupon_id'] ?? null,
                'order_number' => $data['order_number'],
                'status' => $data['status'] ?? OrderStatus::Pending->value,
                'total_amount' => $data['total_amount'],
                'payment_status' => $data['payment_status'] ?? PaymentStatus::Pending->value,
                'payment_method' => $data['payment_method'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            // Crear los items del pedido si existen
            if (isset($data['items']) && is_array($data['items'])) {
                foreach ($data['items'] as $item) {
                    $order->items()->create([
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'product_name_snapshot' => $item['product_name_snapshot'] ?? 'Producto sin nombre',
                        'sku_snapshot' => $item['sku_snapshot'] ?? 'SKU-GENERICO',
                    ]);
                }
            }

            return $order->load(['items.product', 'shippingAddress', 'billingAddress', 'coupon']);
        });
    }

    /**
     * Buscar pedido por número de pedido
     */
    public function findByOrderNumber(string $orderNumber): ?Order
    {
        return Order::where('order_number', $orderNumber)
            ->with(['items.product', 'user', 'shippingAddress', 'billingAddress', 'coupon', 'shipment', 'payments'])
            ->first();
    }

    /**
     * Obtener pedidos de un usuario
     */
    public function getUserOrders(string $userId, int $perPage = 10): LengthAwarePaginator
    {
        return Order::where('user_id', $userId)
            ->with(['items.product', 'shippingAddress', 'billingAddress', 'coupon', 'shipment', 'payments'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Actualizar estado de un pedido
     */
    public function updateStatus(string $orderId, string $status): bool
    {
        $order = Order::find($orderId);

        if (! $order) {
            return false;
        }

        return $order->update(['status' => $status]);
    }

    /**
     * Obtener pedido por ID con relaciones
     */
    public function findWithItems(string $orderId): ?Order
    {
        return Order::with(['items.product', 'user'])
            ->with(['shippingAddress', 'billingAddress', 'coupon', 'shipment', 'payments'])
            ->find($orderId);
    }

    /**
     * Obtener pedidos recientes
     */
    public function getRecentOrders(int $limit = 10): Collection
    {
        return Order::with(['items.product', 'user', 'shippingAddress', 'billingAddress', 'coupon', 'shipment', 'payments'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getLatestUserOrders(string $userId): Collection
    {
        return Order::where('user_id', $userId)
            ->with(['items.product', 'shippingAddress', 'billingAddress', 'coupon', 'shipment', 'payments'])
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
