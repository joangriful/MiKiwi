<?php

declare(strict_types=1);

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
    private const ORDER_RELATIONS = [
        'items.product',
        'items.accessories.product',
        'user',
        'shippingAddress',
        'billingAddress',
        'coupon',
        'shipment',
        'payments',
    ];

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
                    $orderItem = $order->items()->create([
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'product_name_snapshot' => $item['product_name_snapshot'] ?? 'Producto sin nombre',
                        'sku_snapshot' => $item['sku_snapshot'] ?? 'SKU-GENERICO',
                        'configuration_snapshot' => $item['configuration_snapshot'] ?? null,
                    ]);

                    foreach (($item['accessories'] ?? []) as $accessory) {
                        if (! is_array($accessory)) {
                            continue;
                        }

                        $orderItem->accessories()->create([
                            'product_id' => $accessory['product_id'],
                            'product_name_snapshot' => $accessory['product_name_snapshot'] ?? $accessory['name'] ?? 'Accesorio sin nombre',
                            'sku_snapshot' => $accessory['sku_snapshot'] ?? $accessory['sku'] ?? 'SKU-GENERICO',
                            'category' => $accessory['category'] ?? null,
                            'view' => $accessory['view'] ?? null,
                            'unit_price' => $accessory['unit_price'],
                            'quantity' => $accessory['quantity'] ?? 1,
                            'visual_data_snapshot' => $accessory['visual_data_snapshot'] ?? null,
                        ]);
                    }
                }
            }

            return $order->load(['items.product', 'items.accessories.product', 'shippingAddress', 'billingAddress', 'coupon']);
        });
    }

    /**
     * Buscar pedido por número de pedido
     */
    public function findByOrderNumber(string $orderNumber): ?Order
    {
        return Order::query()
            ->where('order_number', $orderNumber)
            ->with(self::ORDER_RELATIONS)
            ->first();
    }

    /**
     * Obtener pedidos de un usuario
     */
    public function getUserOrders(string $userId, int $perPage = 10): LengthAwarePaginator
    {
        return Order::query()
            ->where('user_id', $userId)
            ->with(self::ORDER_RELATIONS)
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
        return Order::query()
            ->with(self::ORDER_RELATIONS)
            ->find($orderId);
    }

    /**
     * Obtener pedidos recientes
     */
    public function getRecentOrders(int $limit = 10): Collection
    {
        return Order::query()
            ->with(self::ORDER_RELATIONS)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getLatestUserOrders(string $userId): Collection
    {
        return Order::query()
            ->where('user_id', $userId)
            ->with(self::ORDER_RELATIONS)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
