<?php

declare(strict_types=1);

namespace App\Domain\Addresses\Repositories\Interfaces;

use App\Models\Address;
use Illuminate\Database\Eloquent\Collection;

interface UserAddressRepositoryInterface
{
    /**
     * Obtener todas las direcciones de un usuario
     */
    public function getUserAddresses(string $userId): Collection;

    /**
     * Obtener dirección por ID
     */
    public function findById(string $id): ?Address;

    /**
     * Crear nueva dirección
     */
    public function create(array $data): Address;

    /**
     * Actualizar dirección existente
     */
    public function update(string $id, array $data): ?Address;

    /**
     * Eliminar dirección
     */
    public function delete(string $id): bool;

    /**
     * Establecer dirección como predeterminada
     * y quitar predeterminada de las demás del usuario
     */
    public function setAsDefault(string $addressId, string $userId): void;

    /**
     * Obtener dirección predeterminada del usuario
     */
    public function getDefaultAddress(string $userId): ?Address;

    /**
     * Contar direcciones de un usuario
     */
    public function countUserAddresses(string $userId): int;
}
