<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\UserAddress;
use App\Repositories\Interfaces\UserAddressRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentUserAddressRepository implements UserAddressRepositoryInterface
{
    /**
     * Obtener todas las direcciones de un usuario ordenadas
     */
    public function getUserAddresses(string $userId): Collection
    {
        return UserAddress::where('user_id', $userId)
            ->orderByDesc('is_default')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Buscar dirección por ID
     */
    public function findById(string $id): ?UserAddress
    {
        return UserAddress::find($id);
    }

    /**
     * Crear nueva dirección
     */
    public function create(array $data): UserAddress
    {
        return UserAddress::create($data);
    }

    /**
     * Actualizar dirección existente
     */
    public function update(string $id, array $data): ?UserAddress
    {
        $address = $this->findById($id);

        if (! $address) {
            return null;
        }

        $address->update($data);

        return $address->fresh();
    }

    /**
     * Eliminar dirección
     */
    public function delete(string $id): bool
    {
        $address = $this->findById($id);

        if (! $address) {
            return false;
        }

        return $address->delete();
    }

    /**
     * Establecer dirección como predeterminada
     * Transacción atómica: quita predeterminada de otras y marca esta
     */
    public function setAsDefault(string $addressId, string $userId): void
    {
        \Illuminate\Support\Facades\DB::transaction(function () use ($addressId, $userId) {
            // Quitar predeterminada de todas las direcciones del usuario
            UserAddress::where('user_id', $userId)
                ->update(['is_default' => false]);

            // Marcar la dirección seleccionada como predeterminada
            UserAddress::where('id', $addressId)
                ->where('user_id', $userId)
                ->update(['is_default' => true]);
        });
    }

    /**
     * Obtener dirección predeterminada del usuario
     */
    public function getDefaultAddress(string $userId): ?UserAddress
    {
        return UserAddress::where('user_id', $userId)
            ->where('is_default', true)
            ->first();
    }

    /**
     * Contar direcciones de un usuario
     */
    public function countUserAddresses(string $userId): int
    {
        return UserAddress::where('user_id', $userId)->count();
    }
}
