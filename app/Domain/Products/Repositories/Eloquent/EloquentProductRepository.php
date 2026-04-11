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
}
