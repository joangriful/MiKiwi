<?php

namespace App\Http\Controllers;

use App\Domain\Carts\Services\CartService;
use App\Domain\Coupons\Services\CouponService;
use App\Exceptions\InvalidCouponException;
use App\Http\Requests\ApplyCouponRequest;

class CouponController extends Controller
{
    public function __construct(
        protected CartService $cartService,
        protected CouponService $couponService,
    ) {}

    public function apply(ApplyCouponRequest $request)
    {
        try {
            $this->couponService->applyCoupon(
                $request->validated()['code'],
                $this->cartService->getCart()['total']
            );
        } catch (InvalidCouponException $exception) {
            return redirect()
                ->route('cart.index')
                ->withErrors(['coupon' => $exception->getMessage()]);
        }

        return redirect()->route('cart.index')->with('success', 'Cupón aplicado correctamente.');
    }

    public function remove()
    {
        $this->couponService->removeCoupon();

        return redirect()->back()->with('success', 'Cupón eliminado.');
    }
}
