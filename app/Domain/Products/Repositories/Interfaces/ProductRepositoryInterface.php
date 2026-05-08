<?php

declare(strict_types=1);

namespace App\Domain\Products\Repositories\Interfaces;

use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ProductRepositoryInterface
{
    public function getActiveBySlug(string $slug): ?Product;

    public function getActiveInStockBySlug(string $slug): ?Product;

    public function getActiveBySlugs(array $slugs): Collection;

    public function getAccessories(string $productId): Collection;

    public function getAllActivePaginated(int $perPage = 12): LengthAwarePaginator;

    public function getFeaturedActive(): Collection;

    public function getRandomActiveInStockByCategoryIds(array $categoryIds, int $limit = 4): Collection;

    public function getRandomActiveInStockByCollectionSlug(string $collectionSlug, int $limit = 4): Collection;

    public function getRandomFeaturedActive(int $limit = 4): Collection;

    public function getLatestActiveInStock(int $limit = 4): Collection;

    public function getCartPopularProducts(int $limit = 8): Collection;

    public function getAllForAdmin(): Collection;
}
