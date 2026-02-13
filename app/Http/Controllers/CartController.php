<?php

namespace App\Http\Controllers;

use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Mostrar el carrito de compras
     * 
     * @return \Inertia\Response
     */
    public function index()
    {
        $cart = $this->cartService->getCart();
        $popularProducts = \App\Models\Product::where('is_active', true)
            ->whereIn('product_type', ['configurable', 'simple'])
            ->limit(8)
            ->get();

        $couponData = session('coupon');
        \Log::info("CartController::index - Coupon in session: " . json_encode($couponData));
        
        if ($couponData) {
            $coupon = \App\Models\Coupon::where('code', $couponData['code'])->first();
            if ($coupon && $coupon->isValid()) {
                $couponData['discount'] = $coupon->calculateDiscount($cart['total']);
                session(['coupon' => $couponData]); // Update session with new discount
            } else {
                session()->forget('coupon'); // Remove invalid coupon
                $couponData = null;
            }
        }

        return Inertia::render('Cart', [
            'cart' => $cart,
            'popularProducts' => $popularProducts,
            'pageTitle' => 'Carrito de Compras - MiKiwi',
            'stripeKey' => config('services.stripe.key'),
            'coupon' => $couponData,
        ]);
    }

    /**
     * Agregar producto al carrito
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'product_slug' => 'required|string',
                'quantity' => 'required|integer|min:1',
                'accessories' => 'nullable|array'
            ]);

            $cart = $this->cartService->addToCart(
                $validated['product_slug'],
                $validated['quantity'],
                $validated['accessories'] ?? []
            );

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Producto agregado al carrito',
                    'cart' => $cart
                ]);
            }

            return redirect()->back()->with('success', 'Producto agregado al carrito');
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage()
                ], 400);
            }
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Actualizar cantidad de un producto en el carrito
     * 
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'quantity' => 'required|integer|min:0'
            ]);

            if ($validated['quantity'] <= 0) {
                $this->cartService->removeFromCart($id);
                return redirect()->back()->with('success', 'Producto eliminado');
            }

            $this->cartService->updateQuantity($id, $validated['quantity']);

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Cantidad actualizada'
                ]);
            }

            return redirect()->back()->with('success', 'Cantidad actualizada');
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
            }
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Eliminar producto del carrito
     * 
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(string $id)
    {
        try {
            $this->cartService->removeFromCart($id);

            return redirect()->back()->with('success', 'Producto eliminado del carrito');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Vaciar el carrito
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function clear(Request $request)
    {
        try {
            $this->cartService->clearCart();

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Carrito vaciado'
                ]);
            }

            return redirect()->back()->with('success', 'Carrito vaciado');
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
            }
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
