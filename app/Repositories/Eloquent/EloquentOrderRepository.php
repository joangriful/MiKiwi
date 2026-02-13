<?php

namespace App\Repositories\Eloquent;

use App\Models\Order;
use App\Repositories\Interfaces\OrderRepositoryInterface;
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
                'order_number' => $data['order_number'],
                'status' => $data['status'] ?? 'pending',
                'total_amount' => $data['total_amount'],
                'payment_status' => $data['payment_status'] ?? 'pending',
                'payment_method' => $data['payment_method'] ?? null,
                'shipping_address_snapshot' => $data['shipping_address_snapshot'] ?? null,
                'billing_address_snapshot' => $data['billing_address_snapshot'] ?? null,
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

            return $order->load('items.product');
        });
    }

    /**
     * Buscar pedido por número de pedido
     */
    public function findByOrderNumber(string $orderNumber): ?Order
    {
        return Order::where('order_number', $orderNumber)
            ->with(['items.product', 'user'])
            ->first();
    }

    /**
     * Obtener pedidos de un usuario
     */
    public function getUserOrders(string $userId, int $perPage = 10): LengthAwarePaginator
    {
        return Order::where('user_id', $userId)
            ->with('items.product')
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
            ->find($orderId);
    }

    /**
     * Obtener pedidos recientes
     */
    public function getRecentOrders(int $limit = 10): Collection
    {
        return Order::with(['items.product', 'user'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }
}
