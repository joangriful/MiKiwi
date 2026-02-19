<?php

namespace App\Http\Controllers;

use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
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
        $popularProducts = Cache::remember('cart_popular_products', 300, function () {
            return \App\Models\Product::where('is_active', true)
                ->whereIn('product_type', ['configurable', 'simple'])
                ->select(['id', 'slug', 'name', 'base_price', 'images'])
                ->orderByDesc('created_at')
                ->limit(8)
                ->get();
        });

        $couponData = session('coupon');

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
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'product_slug' => 'required|string',
                'quantity' => 'required|integer|min:1',
                'accessories' => 'nullable|array',
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
                    'cart' => $cart,
                ]);
            }

            return redirect()->back()->with('success', 'Producto agregado al carrito');
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage(),
                ], 400);
            }

            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Actualizar cantidad de un producto en el carrito
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'quantity' => 'required|integer|min:1',
            ]);

            if ($validated['quantity'] <= 0) {
                $this->cartService->removeFromCart($id);

                return redirect()->back()->with('success', 'Producto eliminado');
            }

            $cart = $this->cartService->updateQuantity($id, $validated['quantity']);

            return response()->json([
                'success' => true,
                'message' => 'Cantidad actualizada',
                'cart' => $cart,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Eliminar producto del carrito
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(string $id)
    {
        try {
            $cart = $this->cartService->removeFromCart($id);

            return response()->json([
                'success' => true,
                'message' => 'Producto eliminado del carrito',
                'cart' => $cart,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Vaciar el carrito
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function clear(Request $request)
    {
        try {
            $this->cartService->clearCart();

            return response()->json([
                'success' => true,
                'message' => 'Carrito vaciado',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
