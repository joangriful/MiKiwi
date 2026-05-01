<?php

declare(strict_types=1);

namespace App\Domain\Coupons\Actions;

use App\Models\Coupon;

class ValidateCoupon
{
    public function execute(Coupon $coupon): bool
    {
        if (! $coupon->is_active) {
            return false;
        }

        if ($coupon->expires_at && $coupon->expires_at->isPast()) {
            return false;
        }

        return true;
    }
}
