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

        return Inertia::render('Cart/Index', [
            'cart' => $cart,
            'pageTitle' => 'Carrito de Compras - MiKiwi'
        ]);
    }

    /**
     * Agregar producto al carrito
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
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

            return response()->json([
                'success' => true,
                'message' => 'Producto agregado al carrito',
                'cart' => $cart
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Actualizar cantidad de un producto en el carrito
     * 
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'quantity' => 'required|integer|min:1'
            ]);

            $cart = $this->cartService->updateQuantity($id, $validated['quantity']);

            return response()->json([
                'success' => true,
                'message' => 'Cantidad actualizada',
                'cart' => $cart
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Eliminar producto del carrito
     * 
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(string $id)
    {
        try {
            $cart = $this->cartService->removeFromCart($id);

            return response()->json([
                'success' => true,
                'message' => 'Producto eliminado del carrito',
                'cart' => $cart
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Vaciar el carrito
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function clear()
    {
        try {
            $this->cartService->clearCart();

            return response()->json([
                'success' => true,
                'message' => 'Carrito vaciado'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
