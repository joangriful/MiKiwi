<?php

namespace App\Domain\Products\Repositories\Interfaces;

use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ProductRepositoryInterface
{
    public function getActiveBySlug(string $slug): ?Product;

    public function getActiveBySlugs(array $slugs): Collection;

    public function getAccessories(string $productId): Collection;

    public function getAllActivePaginated(int $perPage = 12): LengthAwarePaginator;
}
