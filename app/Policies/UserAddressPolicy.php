<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use App\Models\UserAddress;

class UserAddressPolicy
{
    /**
     * Determina si el usuario puede ver el listado de direcciones
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determina si el usuario puede ver una dirección específica
     */
    public function view(User $user, UserAddress $address): bool
    {
        return $user->id === $address->user_id;
    }

    /**
     * Determina si el usuario puede crear direcciones
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determina si el usuario puede actualizar una dirección
     */
    public function update(User $user, UserAddress $address): bool
    {
        return $user->id === $address->user_id;
    }

    /**
     * Determina si el usuario puede eliminar una dirección
     */
    public function delete(User $user, UserAddress $address): bool
    {
        return $user->id === $address->user_id;
    }

    /**
     * Determina si el usuario puede establecer una dirección como predeterminada
     */
    public function setDefault(User $user, UserAddress $address): bool
    {
        return $user->id === $address->user_id;
    }
}
