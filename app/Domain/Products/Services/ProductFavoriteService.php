<?php

namespace App\Domain\Products\Services;

use App\Models\Product;
use App\Models\ProductFavorite;
use App\Models\User;

class ProductFavoriteService
{
    public function add(User $user, Product $product): void
    {
        ProductFavorite::query()->firstOrCreate([
            'user_id' => $user->getKey(),
            'product_id' => $product->getKey(),
        ]);
    }

    public function remove(User $user, Product $product): void
    {
        ProductFavorite::query()
            ->where('user_id', $user->getKey())
            ->where('product_id', $product->getKey())
            ->delete();
    }
}
