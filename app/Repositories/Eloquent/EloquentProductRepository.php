<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Product;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentProductRepository implements ProductRepositoryInterface
{
    protected array $cartColumns = [
        'id',
        'slug',
        'name',
        'sku',
        'base_price',
        'stock_quantity',
        'images',
        'image_url',
        'hover_image_url',
    ];

    public function getActiveBySlug(string $slug): ?Product
    {
        return Product::active()
            ->where('slug', $slug)
            ->select(['id', 'slug', 'category_id', 'name', 'description', 'base_price', 'stock_quantity', 'images', 'image_url', 'hover_image_url'])
            ->with(['category' => function ($q) {
                $q->with('parent');
            }, 'accessories'])
            ->first();
    }

    public function getActiveBySlugForCart(string $slug): ?Product
    {
        return Product::active()
            ->where('slug', $slug)
            ->select($this->cartColumns)
            ->first();
    }

    public function getActiveBySlugs(array $slugs): Collection
    {
        return Product::active()
            ->whereIn('slug', $slugs)
            ->with(['category', 'accessories'])
            ->get();
    }

    public function getActiveBySlugsForCart(array $slugs): Collection
    {
        return Product::active()
            ->whereIn('slug', $slugs)
            ->select($this->cartColumns)
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
