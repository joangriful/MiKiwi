<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Domain\Carts\Services\CartService;
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
        \Log::info("CouponController::apply called with code: " . $request->code);

        $request->validate([
            'code' => 'required|string|exists:coupons,code',
        ]);

        $coupon = Coupon::where('code', $request->code)->first();

        if (!$coupon) {
            \Log::info("Coupon validation failed: Code not found: {$request->code}");
            return redirect()->route('cart.index')->withErrors(['coupon' => 'El cupón no es válido.']);
        }

        if (!$coupon->isValid()) {
            \Log::info("Coupon validation failed: Invalid or expired: {$request->code}");
            return redirect()->route('cart.index')->withErrors(['coupon' => 'El cupón ha expirado o no es válido.']);
        }

        $cartTotal = $this->cartService->getCart()['total'];
        $discount = $coupon->calculateDiscount($cartTotal);
        
        \Log::info("Coupon valid. Total: $cartTotal, Discount: $discount");

        // Store coupon in session via CartService (or directly for now)
        session([
            'coupon' => [
                'code' => $coupon->code,
                'type' => $coupon->type,
                'value' => $coupon->value,
                'discount' => $discount,
            ]
        ]);
        
        \Log::info("Coupon stored in session. Session data: " . json_encode(session('coupon')));

        return redirect()->route('cart.index')->with('success', 'Cupón aplicado correctamente.');
    }

    public function remove()
    {
        session()->forget('coupon');
        return redirect()->back()->with('success', 'Cupón eliminado.');
    }
}
