<?php

declare(strict_types=1);

namespace App\Domain\Dolls\Services;

use App\Enums\ProductType;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;

class ConfigurableDollProductService
{
    private const READY_DOLL_SKUS = [
        'DOLL-QUEEN-001',
        'DOLL-HAT-001',
        'DOLL-BIKINI-001',
        'DOLL-WITCH-001',
    ];

    public function getDefaultDollProduct(): ?Product
    {
        return Product::query()
            ->active()
            ->whereIn('product_type', [
                ProductType::Configurable->value,
                ProductType::Doll->value,
            ])
            ->with(['category', 'images'])
            ->orderByRaw("CASE WHEN product_type = ? THEN 0 ELSE 1 END", [ProductType::Configurable->value])
            ->orderByDesc('is_promoted')
            ->orderBy('name')
            ->first();
    }

    /**
     * @return Collection<int, Product>
     */
    public function getReadyDollProducts(): Collection
    {
        $products = Product::query()
            ->active()
            ->inStock()
            ->where('product_type', ProductType::Doll->value)
            ->whereIn('sku', self::READY_DOLL_SKUS)
            ->with(['category', 'images'])
            ->get();

        $orderBySku = array_flip(self::READY_DOLL_SKUS);

        return $products
            ->sortBy(fn (Product $product): int => $orderBySku[$product->sku] ?? PHP_INT_MAX)
            ->values();
    }
}
