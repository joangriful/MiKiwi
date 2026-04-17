<?php

namespace App\Domain\Orders\Repositories\Interfaces;

use App\Models\Order;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface OrderRepositoryInterface
{
    /**
     * Crear un nuevo pedido
     */
    public function create(array $data): Order;

    /**
     * Buscar pedido por número de pedido
     */
    public function findByOrderNumber(string $orderNumber): ?Order;

    /**
     * Obtener pedidos de un usuario
     */
    public function getUserOrders(string $userId, int $perPage = 10): LengthAwarePaginator;

    /**
     * Actualizar estado de un pedido
     */
    public function updateStatus(string $orderId, string $status): bool;

    /**
     * Obtener pedido por ID con relaciones
     */
    public function findWithItems(string $orderId): ?Order;

    /**
     * Obtener pedidos recientes
     */
    public function getRecentOrders(int $limit = 10): Collection;

    public function getLatestUserOrders(string $userId): Collection;
}
