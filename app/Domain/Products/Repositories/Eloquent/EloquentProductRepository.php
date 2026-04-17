<?php

declare(strict_types=1);

namespace App\Domain\Products\Repositories\Eloquent;

use App\Models\Product;
use App\Domain\Products\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentProductRepository implements ProductRepositoryInterface
{
    public function getActiveBySlug(string $slug): ?Product
    {
        return Product::active()
            ->where('slug', $slug)
            ->with(['category' => function($q) {
                $q->with('parent');
            }, 'accessories', 'reviews'])
            ->first();
    }

    public function getActiveBySlugs(array $slugs): Collection
    {
        return Product::active()
            ->whereIn('slug', $slugs)
            ->with(['category', 'accessories'])
            ->get();
    }

    public function getAccessories(string $productId): Collection
    {
        $product = Product::find($productId);

        return $product ? $product->accessories : new Collection;
    }

    public function getAllActivePaginated(int $perPage = 12): LengthAwarePaginator
    {
        return Product::active()
            ->inStock()
            ->with('category')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getFeaturedActive(): Collection
    {
        return Product::active()
            ->inStock()
            ->with('category:id,name')
            ->where('is_featured', true)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getRandomActiveInStockByCategoryIds(array $categoryIds, int $limit = 4): Collection
    {
        return Product::active()
            ->inStock()
            ->with('category:id,name')
            ->whereIn('category_id', $categoryIds)
            ->inRandomOrder()
            ->limit($limit)
            ->get();
    }

    public function getRandomFeaturedActive(int $limit = 4): Collection
    {
        return Product::active()
            ->inStock()
            ->with('category:id,name')
            ->where('is_featured', true)
            ->inRandomOrder()
            ->limit($limit)
            ->get();
    }

    public function getLatestActiveInStock(int $limit = 4): Collection
    {
        return Product::active()
            ->inStock()
            ->with('category:id,name')
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function getAllForAdmin(): Collection
    {
        return Product::with('category:id,name')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
