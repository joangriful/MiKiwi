<?php

declare(strict_types=1);

namespace App\Domain\Products\Repositories\Eloquent;

use App\Domain\Products\Repositories\Interfaces\ProductRepositoryInterface;
use App\Enums\ProductType;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentProductRepository implements ProductRepositoryInterface
{
    /**
     * @return Builder<Product>
     */
    private function activeProductsQuery(): Builder
    {
        return Product::query()->active()->simple();
    }

    /**
     * @return Builder<Product>
     */
    private function activeInStockProductsQuery(): Builder
    {
        return $this->activeProductsQuery()->inStock();
    }

    /**
     * @return array<int, string>
     */
    private function purchasableProductTypes(): array
    {
        return [
            ProductType::Simple->value,
            ProductType::Doll->value,
            ProductType::Configurable->value,
        ];
    }

    /**
     * @return Builder<Product>
     */
    private function purchasableProductsQuery(): Builder
    {
        return Product::query()
            ->active()
            ->whereIn('product_type', $this->purchasableProductTypes());
    }

    public function getActiveBySlug(string $slug): ?Product
    {
        return $this->activeProductsQuery()
            ->where('slug', $slug)
            ->with([
                'category',
                'images',
                'accessories',
                'reviews' => fn ($query) => $query->approved()->latest(),
            ])
            ->first();
    }

    public function getActiveInStockBySlug(string $slug): ?Product
    {
        return $this->purchasableProductsQuery()
            ->inStock()
            ->where('slug', $slug)
            ->with([
                'category',
                'images',
                'accessories',
                'reviews' => fn ($query) => $query->approved()->latest(),
            ])
            ->first();
    }

    public function getActiveBySlugs(array $slugs): Collection
    {
        return $this->purchasableProductsQuery()
            ->whereIn('slug', $slugs)
            ->with(['category', 'images', 'accessories'])
            ->get();
    }

    public function getAccessories(string $productId): Collection
    {
        $product = Product::find($productId);

        return $product ? $product->accessories : new Collection;
    }

    public function getAllActivePaginated(int $perPage = 12): LengthAwarePaginator
    {
        return $this->activeInStockProductsQuery()
            ->with(['category', 'images'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getFeaturedActive(): Collection
    {
        return $this->activeInStockProductsQuery()
            ->with(['category:id,name,slug', 'images'])
            ->where('is_promoted', true)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getRandomActiveInStockByCategoryIds(array $categoryIds, int $limit = 4): Collection
    {
        return $this->activeInStockProductsQuery()
            ->with(['category:id,name,slug', 'images'])
            ->whereIn('category_id', $categoryIds)
            ->inRandomOrder()
            ->limit($limit)
            ->get();
    }

    public function getRandomActiveInStockByCollectionSlug(string $collectionSlug, int $limit = 4): Collection
    {
        return $this->activeInStockProductsQuery()
            ->with(['category:id,name,slug', 'images'])
            ->whereHas('collections', function (Builder $query) use ($collectionSlug): void {
                $query->where('collection.slug', $collectionSlug)
                    ->where('collection.is_active', true);
            })
            ->inRandomOrder()
            ->limit($limit)
            ->get();
    }

    public function getRandomFeaturedActive(int $limit = 4): Collection
    {
        return $this->activeInStockProductsQuery()
            ->with(['category:id,name,slug', 'images'])
            ->where('is_promoted', true)
            ->inRandomOrder()
            ->limit($limit)
            ->get();
    }

    public function getLatestActiveInStock(int $limit = 4): Collection
    {
        return $this->activeInStockProductsQuery()
            ->with(['category:id,name,slug', 'images'])
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function getCartPopularProducts(int $limit = 8): Collection
    {
        return $this->activeInStockProductsQuery()
            ->with('images')
            ->limit($limit)
            ->get();
    }

    public function getAllForAdmin(): Collection
    {
        return Product::with(['category:id,name', 'images'])
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
