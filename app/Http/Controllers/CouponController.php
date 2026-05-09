<?php

namespace App\Http\Controllers;

use App\Domain\Carts\Services\CartService;
use App\Domain\Coupons\Services\CouponService;
use App\Exceptions\InvalidCouponException;
use App\Http\Requests\ApplyCouponRequest;
use Illuminate\Support\Facades\Auth;

class CouponController extends Controller
{
    public function __construct(
        protected CartService $cartService,
        protected CouponService $couponService,
    ) {}

    public function apply(ApplyCouponRequest $request)
    {
        try {
            $cart = $this->cartService->getCart();

            $this->couponService->applyCoupon(
                $request->validated()['code'],
                (float) ($cart['total'] ?? 0),
                $cart,
                Auth::id() ? (string) Auth::id() : null,
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
