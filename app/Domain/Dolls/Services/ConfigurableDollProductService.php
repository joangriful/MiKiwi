<?php

declare(strict_types=1);

namespace App\Domain\Dolls\Services;

use App\Enums\ProductType;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;

class ConfigurableDollProductService
{
    public const BASE_DOLL_SKU = 'DOLL-BASE-001';

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
            ->where('product_type', ProductType::Doll->value)
            ->where('sku', self::BASE_DOLL_SKU)
            ->with(['category', 'images'])
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
