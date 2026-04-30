<?php

declare(strict_types=1);

namespace App\Domain\Coupons\Actions;

use App\Enums\CouponType;
use App\Models\Coupon;

class CalculateCouponDiscount
{
    public function execute(Coupon $coupon, float $subtotal): float
    {
        if ($coupon->type === CouponType::Percent->value) {
            return ($subtotal * (float) $coupon->value) / 100;
        }

        return min((float) $coupon->value, $subtotal);
    }
}
