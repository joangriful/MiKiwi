<?php

declare(strict_types=1);

namespace App\Domain\Dolls\Services;

use App\Enums\ProductType;
use App\Models\Product;

class ConfigurableDollProductService
{
    public function getDefaultDollProduct(): ?Product
    {
        return Product::query()
            ->active()
            ->inStock()
            ->where('product_type', ProductType::Configurable->value)
            ->with(['category', 'images'])
            ->orderByDesc('is_promoted')
            ->orderBy('name')
            ->first();
    }
}
