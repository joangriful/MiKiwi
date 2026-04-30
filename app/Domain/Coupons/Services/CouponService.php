<?php

declare(strict_types=1);

namespace App\Domain\Coupons\Services;

use App\Domain\Coupons\Actions\CalculateCouponDiscount;
use App\Domain\Coupons\Actions\ValidateCoupon;
use App\Exceptions\InvalidCouponException;
use App\Models\Coupon;
use Illuminate\Support\Facades\Session;

class CouponService
{
    private const SESSION_KEY = 'coupon';

    public function __construct(
        private readonly ValidateCoupon $validateCoupon,
        private readonly CalculateCouponDiscount $calculateCouponDiscount,
    ) {}

    public function findByCode(string $code): ?Coupon
    {
        return Coupon::query()
            ->where('code', $code)
            ->first();
    }

    public function isValid(Coupon $coupon): bool
    {
        return $this->validateCoupon->execute($coupon);
    }

    public function calculateDiscount(Coupon $coupon, float $total): float
    {
        return $this->calculateCouponDiscount->execute($coupon, $total);
    }

    public function applyCoupon(string $code, float $cartTotal): array
    {
        $coupon = $this->findByCode($code);

        if (! $coupon) {
            throw new InvalidCouponException('El cupón no es válido.');
        }

        if (! $this->isValid($coupon)) {
            throw new InvalidCouponException('El cupón ha expirado o no es válido.');
        }

        $couponData = [
            'code' => $coupon->code,
            'type' => $coupon->type,
            'value' => $coupon->value,
            'discount' => $this->calculateDiscount($coupon, $cartTotal),
        ];

        Session::put(self::SESSION_KEY, $couponData);

        return $couponData;
    }

    public function refreshSessionCoupon(float $cartTotal): ?array
    {
        $couponData = Session::get(self::SESSION_KEY);

        if (! is_array($couponData) || ! isset($couponData['code'])) {
            return null;
        }

        $coupon = $this->findByCode((string) $couponData['code']);

        if (! $coupon || ! $this->isValid($coupon)) {
            $this->removeCoupon();

            return null;
        }

        $couponData = [
            'code' => $coupon->code,
            'type' => $coupon->type,
            'value' => $coupon->value,
            'discount' => $this->calculateDiscount($coupon, $cartTotal),
        ];

        Session::put(self::SESSION_KEY, $couponData);

        return $couponData;
    }

    public function removeCoupon(): void
    {
        Session::forget(self::SESSION_KEY);
    }
}
