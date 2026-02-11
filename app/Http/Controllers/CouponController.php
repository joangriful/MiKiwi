<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Services\CartService;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    public function apply(Request $request)
    {
        $request->validate([
            'code' => 'required|string|exists:coupons,code',
        ]);

        $coupon = Coupon::where('code', $request->code)->first();

        if (!$coupon || !$coupon->isValid()) {
            return redirect()->back()->withErrors(['coupon' => 'El cupón no es válido o ha expirado.']);
        }

        // Store coupon in session via CartService (or directly for now)
        session([
            'coupon' => [
                'code' => $coupon->code,
                'type' => $coupon->type,
                'value' => $coupon->value,
                'discount' => $coupon->calculateDiscount($this->cartService->getCart()['total']),
            ]
        ]);

        return redirect()->back()->with('success', 'Cupón aplicado correctamente.');
    }

    public function remove()
    {
        session()->forget('coupon');
        return redirect()->back()->with('success', 'Cupón eliminado.');
    }
}
