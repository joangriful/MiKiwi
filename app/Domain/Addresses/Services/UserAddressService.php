<?php

declare(strict_types=1);

namespace App\Domain\Addresses\Services;

use App\Domain\Addresses\Repositories\Interfaces\UserAddressRepositoryInterface;
use App\Models\Address;
use Illuminate\Database\Eloquent\Collection;

class UserAddressService
{
    public function __construct(
        private readonly UserAddressRepositoryInterface $repository,
    ) {}

    public function getUserAddresses(string $userId): Collection
    {
        return $this->repository->getUserAddresses($userId);
    }

    public function createAddress(string $userId, array $data): Address
    {
        $data['user_id'] = $userId;

        // Si es la primera dirección, marcar como predeterminada
        if ($this->repository->countUserAddresses($userId) === 0) {
            $data['is_default'] = true;
        }

        $address = $this->repository->create($data);

        // Si se marca como predeterminada, actualizar las demás
        if (! empty($data['is_default']) && $data['is_default']) {
            $this->repository->setAsDefault($address->id, $userId);
        }

        return $address;
    }

    public function updateAddress(string $addressId, string $userId, array $data): ?Address
    {
        $address = $this->repository->findById($addressId);

        if (! $address || $address->user_id !== $userId) {
            return null;
        }

        $updated = $this->repository->update($addressId, $data);

        // Si se marca como predeterminada, actualizar las demás
        if ($updated && ! empty($data['is_default']) && $data['is_default']) {
            $this->repository->setAsDefault($addressId, $userId);
        }

        return $updated;
    }

    public function deleteAddress(string $addressId, string $userId): bool
    {
        $address = $this->repository->findById($addressId);

        if (! $address || $address->user_id !== $userId) {
            return false;
        }

        return $this->repository->delete($addressId);
    }

    public function setDefaultAddress(string $addressId, string $userId): void
    {
        $this->repository->setAsDefault($addressId, $userId);
    }

    public function getDefaultAddress(string $userId): ?Address
    {
        return $this->repository->getDefaultAddress($userId);
    }

    public function validateMaxAddresses(string $userId, int $max = 10): bool
    {
        return $this->repository->countUserAddresses($userId) < $max;
    }
}
