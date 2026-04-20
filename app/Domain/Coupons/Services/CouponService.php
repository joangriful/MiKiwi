<?php

declare(strict_types=1);

namespace App\Domain\Coupons\Services;

use App\Models\Coupon;

class CouponService
{
    public function findByCode(string $code): ?Coupon
    {
        return Coupon::where('code', $code)->first();
    }

    public function isValid(Coupon $coupon): bool
    {
        return $coupon->isValid();
    }

    public function calculateDiscount(Coupon $coupon, float $total): float
    {
        return $coupon->calculateDiscount($total);
    }
}
