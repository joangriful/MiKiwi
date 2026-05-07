<?php

declare(strict_types=1);

namespace App\Domain\Profile\Services;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class ProfileFavoriteService
{
    /**
     * @return Collection<int, Product>
     */
    public function getFavoriteProductsForUser(User $user): Collection
    {
        $products = $user->favoriteProducts()
            ->with([
                'category:id,name,slug',
                'images' => fn ($query) => $query
                    ->select(['id', 'product_id', 'image_url', 'alt_text', 'sort_order'])
                    ->orderBy('sort_order'),
            ])
            ->orderByPivot('created_at', 'desc')
            ->get();

        $products->each(fn (Product $product) => $product->setAttribute('is_favorite', true));

        return $products;
    }
}
