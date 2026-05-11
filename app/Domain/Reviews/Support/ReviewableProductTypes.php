<?php

declare(strict_types=1);

namespace App\Domain\Reviews\Support;

use App\Enums\ProductType;
use App\Models\Product;

class ReviewableProductTypes
{
    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return [
            ProductType::Simple->value,
            ProductType::Doll->value,
        ];
    }

    public static function includes(Product $product): bool
    {
        return in_array($product->product_type, self::values(), true);
    }
}
