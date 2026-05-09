<?php

declare(strict_types=1);

namespace App\Domain\Coupons\Services;

use App\Domain\Coupons\Actions\CalculateCouponDiscount;
use App\Domain\Coupons\Actions\ValidateCoupon;
use App\Exceptions\InvalidCouponException;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
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
            ->where('code', strtoupper(trim($code)))
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

    /**
     * @param  array{items?: array<int, array<string, mixed>>, total?: float|int|string}  $cart
     */
    public function applyCoupon(string $code, float $cartTotal, array $cart = [], ?string $userId = null): array
    {
        $coupon = $this->findByCode($code);

        if (! $coupon) {
            throw new InvalidCouponException('El cupón no es válido.');
        }

        $validationError = $this->validationError($coupon, $cartTotal, $cart, $userId);

        if ($validationError !== null) {
            throw new InvalidCouponException($validationError);
        }

        $couponData = $this->sessionPayload($coupon, $cartTotal);

        Session::put(self::SESSION_KEY, $couponData);

        return $couponData;
    }

    /**
     * @param  array{items?: array<int, array<string, mixed>>, total?: float|int|string}  $cart
     */
    public function refreshSessionCoupon(float $cartTotal, array $cart = [], ?string $userId = null): ?array
    {
        $couponData = Session::get(self::SESSION_KEY);

        if (! is_array($couponData) || ! isset($couponData['code'])) {
            return null;
        }

        $coupon = $this->findByCode((string) $couponData['code']);

        if (! $coupon || $this->validationError($coupon, $cartTotal, $cart, $userId) !== null) {
            $this->removeCoupon();

            return null;
        }

        $couponData = $this->sessionPayload($coupon, $cartTotal);

        Session::put(self::SESSION_KEY, $couponData);

        return $couponData;
    }

    /**
     * @param  array{items?: array<int, array<string, mixed>>, total?: float|int|string}  $cart
     */
    public function payableTotal(array $cart, ?string $userId = null): float
    {
        $cartTotal = (float) ($cart['total'] ?? 0);
        $coupon = $this->refreshSessionCoupon($cartTotal, $cart, $userId);
        $discount = is_array($coupon) ? (float) ($coupon['discount'] ?? 0) : 0.0;

        return max(0.0, round($cartTotal - $discount, 2));
    }

    private function sessionPayload(Coupon $coupon, float $cartTotal): array
    {
        return [
            'id' => $coupon->id,
            'code' => $coupon->code,
            'type' => $coupon->type,
            'value' => $coupon->value,
            'discount' => $this->calculateDiscount($coupon, $cartTotal),
        ];
    }

    /**
     * @param  array{items?: array<int, array<string, mixed>>, total?: float|int|string}  $cart
     */
    private function validationError(Coupon $coupon, float $cartTotal, array $cart, ?string $userId): ?string
    {
        if (! $this->isValid($coupon)) {
            return 'El cupón ha expirado o no es válido.';
        }

        if ($coupon->minimum_amount !== null && $cartTotal < (float) $coupon->minimum_amount) {
            return sprintf('Este cupón requiere un pedido mínimo de %.2f €.', (float) $coupon->minimum_amount);
        }

        if ($coupon->required_product_type && ! $this->cartContainsProductType($cart, $coupon->required_product_type)) {
            return 'Este cupón no se puede aplicar a los productos del carrito.';
        }

        if ($coupon->first_order_only && $userId && Order::query()->where('user_id', $userId)->exists()) {
            return 'Este cupón solo es válido para el primer pedido.';
        }

        return null;
    }

    /**
     * @param  array{items?: array<int, array<string, mixed>>}  $cart
     */
    private function cartContainsProductType(array $cart, string $productType): bool
    {
        foreach ($cart['items'] ?? [] as $item) {
            $product = $item['product'] ?? null;

            if ($product instanceof Product && $product->product_type === $productType) {
                return true;
            }

            if (is_array($product) && ($product['product_type'] ?? null) === $productType) {
                return true;
            }
        }

        return false;
    }

    public function removeCoupon(): void
    {
        Session::forget(self::SESSION_KEY);
    }
}
