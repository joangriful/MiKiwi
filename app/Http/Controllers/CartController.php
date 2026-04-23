<?php

namespace App\Http\Controllers;

use App\Domain\Carts\Services\CartService;
use App\Enums\ProductType;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
    public function index(Request $request)
    {
        $cart = $this->cartService->getCart();
        $popularProducts = Product::where('is_active', true)
            ->whereIn('product_type', [
                ProductType::Configurable->value,
                ProductType::Simple->value,
            ])
            ->limit(8)
            ->get();

        $couponData = session('coupon');
        Log::info('CartController::index - Coupon in session: '.json_encode($couponData));

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

        $selectedCart = $request->has('buy_now') && session()->has('buy_now_item')
            ? $this->cartService->getBuyNowItem()
            : $cart;

        return Inertia::render('Checkout/Cart', [
            'cart' => $this->publicCart($selectedCart, $request),
            'isBuyNow' => $request->has('buy_now') && session()->has('buy_now_item'),
            'popularProducts' => ProductResource::collection($popularProducts)->resolve($request),
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
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'quantity' => 'required|integer|min:1',
            ]);

            $this->cartService->updateQuantity($id, $validated['quantity']);

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Cantidad actualizada',
                ]);
            }

            return redirect()->back()->with('success', 'Cantidad actualizada');
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
     * Eliminar producto del carrito
     *
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function destroy(Request $request, string $id)
    {
        try {
            $this->cartService->removeFromCart($id);

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Producto eliminado del carrito',
                ]);
            }

            return redirect()->back()->with('success', 'Producto eliminado del carrito');
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

    /**
     * Comprar un producto directamente (aislado del carrito)
     */
    public function buyNow(Request $request)
    {
        try {
            $validated = $request->validate([
                'product_slug' => 'required|string',
                'quantity' => 'required|integer|min:1',
                'accessories' => 'nullable|array',
            ]);

            $this->cartService->setBuyNowItem(
                $validated['product_slug'],
                $validated['quantity'],
                $validated['accessories'] ?? []
            );

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'redirect' => route('cart.index', ['buy_now' => 1]),
                ]);
            }

            return redirect()->route('cart.index', ['buy_now' => 1]);
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

    private function publicCart(?array $cart, Request $request): ?array
    {
        if ($cart === null) {
            return null;
        }

        $cart['items'] = array_map(function (array $item) use ($request): array {
            if (isset($item['product'])) {
                $item['product'] = ProductResource::make($item['product'])->resolve($request);
            }

            return $item;
        }, $cart['items'] ?? []);

        return $cart;
    }
}
