<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Order;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class OrderPolicy
{
    /**
     * Determina si el usuario puede ver el listado de todos los pedidos
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determina si el usuario puede ver un pedido específico
     */
    public function view(User $user, Order $order): bool
    {
        return $user->id === $order->user_id || $user->role === 'admin';
    }

    /**
     * Determina si el usuario puede crear pedidos
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determina si el usuario puede actualizar un pedido
     */
    public function update(User $user, Order $order): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determina si el usuario puede cancelar un pedido
     */
    public function cancel(User $user, Order $order): Response
    {
        if ($user->id !== $order->user_id && $user->role !== 'admin') {
            return Response::deny('No puedes cancelar este pedido.');
        }

        if (! in_array($order->status, ['pending', 'processing'])) {
            return Response::deny('No se puede cancelar un pedido ya enviado o entregado.');
        }

        return Response::allow();
    }

    /**
     * Determina si el usuario puede eliminar un pedido
     */
    public function delete(User $user, Order $order): bool
    {
        return $user->role === 'admin';
    }
}
