<?php

declare(strict_types=1);

namespace App\Domain\Products\Services;

use App\Domain\Products\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductService
{
    public function __construct(
        private readonly ProductRepositoryInterface $productRepository,
    ) {}

    public function getCatalogItems(): LengthAwarePaginator
    {
        return $this->productRepository->getAllActivePaginated(12);
    }

    public function getFeaturedProducts(): Collection
    {
        return $this->productRepository->getFeaturedActive();
    }

    public function getRecommendedProductsByCategoryIds(array $categoryIds, int $limit = 4): Collection
    {
        return $this->productRepository->getRandomActiveInStockByCategoryIds($categoryIds, $limit);
    }

    public function getRecommendedProductsByCollectionSlug(string $collectionSlug, int $limit = 4): Collection
    {
        return $this->productRepository->getRandomActiveInStockByCollectionSlug($collectionSlug, $limit);
    }

    public function getRandomFeaturedProducts(int $limit = 4): Collection
    {
        return $this->productRepository->getRandomFeaturedActive($limit);
    }

    public function getLatestAvailableProducts(int $limit = 4): Collection
    {
        return $this->productRepository->getLatestActiveInStock($limit);
    }

    public function getCartPopularProducts(int $limit = 8): Collection
    {
        return $this->productRepository->getCartPopularProducts($limit);
    }

    public function getAdminProducts(): Collection
    {
        return $this->productRepository->getAllForAdmin();
    }

    public function getProductDetails(string $slug): array
    {
        $product = $this->productRepository->getActiveBySlug($slug);

        if (! $product) {
            throw new ModelNotFoundException('Producto no encontrado o inactivo.');
        }

        return [
            'product' => $product,
            'accessories' => $product->accessories,
        ];
    }
}
