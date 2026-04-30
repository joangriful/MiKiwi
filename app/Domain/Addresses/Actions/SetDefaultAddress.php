<?php

declare(strict_types=1);

namespace App\Domain\Addresses\Actions;

use App\Domain\Addresses\Repositories\Interfaces\UserAddressRepositoryInterface;

class SetDefaultAddress
{
    public function __construct(
        private readonly UserAddressRepositoryInterface $repository,
    ) {}

    public function execute(string $addressId, string $userId): void
    {
        $this->repository->setAsDefault($addressId, $userId);
    }
}
