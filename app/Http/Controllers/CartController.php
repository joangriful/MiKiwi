<?php

namespace App\Http\Controllers;

use App\Domain\Carts\Services\CartPageService;
use App\Domain\Carts\Services\CartService;
use App\Http\Controllers\Concerns\InteractsWithApiErrors;
use App\Http\Requests\StoreCartRequest;
use App\Http\Requests\UpdateCartRequest;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CartController extends Controller
{
    use InteractsWithApiErrors;

    public function __construct(
        protected CartService $cartService,
        private readonly CartPageService $cartPageService,
    ) {}

    public function index(Request $request)
    {
        $pageData = $this->cartPageService->getPageData($request->boolean('buy_now'));

        return Inertia::render('Checkout/Cart', [
            'cart' => $this->publicCart($pageData['cart'], $request),
            'isBuyNow' => $pageData['isBuyNow'],
            'popularProducts' => ProductResource::collection($pageData['popularProducts'])->resolve($request),
            'pageTitle' => 'Carrito de Compras - MiKiwi',
            'stripeKey' => config('services.stripe.key'),
            'coupon' => $pageData['coupon'],
        ]);
    }

    public function store(StoreCartRequest $request)
    {
        try {
            $validated = $request->validated();

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
            Log::error('Cart add failed: '.$e->getMessage());

            if ($request->wantsJson()) {
                return $this->apiError(
                    'cart_add_failed',
                    'No pudimos agregar el producto al carrito. Inténtalo de nuevo.',
                    400
                );
            }

            return redirect()->back()->withErrors(['error' => 'No pudimos agregar el producto al carrito. Inténtalo de nuevo.']);
        }
    }

    public function update(UpdateCartRequest $request, string $id)
    {
        try {
            $validated = $request->validated();

            $this->cartService->updateQuantity($id, $validated['quantity']);

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Cantidad actualizada',
                ]);
            }

            return redirect()->back()->with('success', 'Cantidad actualizada');
        } catch (\Exception $e) {
            Log::error('Cart update failed: '.$e->getMessage());

            if ($request->wantsJson()) {
                return $this->apiError(
                    'cart_update_failed',
                    'No pudimos actualizar la cantidad del producto. Inténtalo de nuevo.',
                    400
                );
            }

            return redirect()->back()->withErrors(['error' => 'No pudimos actualizar la cantidad del producto. Inténtalo de nuevo.']);
        }
    }

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
            Log::error('Cart delete failed: '.$e->getMessage());

            if ($request->wantsJson()) {
                return $this->apiError(
                    'cart_remove_failed',
                    'No pudimos eliminar el producto del carrito. Inténtalo de nuevo.',
                    400
                );
            }

            return redirect()->back()->withErrors(['error' => 'No pudimos eliminar el producto del carrito. Inténtalo de nuevo.']);
        }
    }

    public function clear(Request $request)
    {
        try {
            $this->cartService->clearCart();

            return response()->json([
                'success' => true,
                'message' => 'Carrito vaciado',
            ]);
        } catch (\Exception $e) {
            Log::error('Cart clear failed: '.$e->getMessage());

            return $this->apiError(
                'cart_clear_failed',
                'No pudimos vaciar el carrito. Inténtalo de nuevo.',
                400
            );
        }
    }

    public function buyNow(StoreCartRequest $request)
    {
        try {
            $validated = $request->validated();

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
            Log::error('Buy now failed: '.$e->getMessage());

            if ($request->wantsJson()) {
                return $this->apiError(
                    'cart_buy_now_failed',
                    'No pudimos preparar la compra directa. Inténtalo de nuevo.',
                    400
                );
            }

            return redirect()->back()->withErrors(['error' => 'No pudimos preparar la compra directa. Inténtalo de nuevo.']);
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
