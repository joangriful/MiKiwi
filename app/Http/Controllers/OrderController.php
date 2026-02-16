<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Exceptions\CartEmptyException;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\CartService;
use App\Services\StripeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class OrderController extends Controller
{
    protected CartService $cartService;

    protected StripeService $stripeService;

    public function __construct(CartService $cartService, StripeService $stripeService)
    {
        // 1. Validar (ocurre automáticamente antes de llegar aquí)
        // 2. Ejecutar la lógica de negocio
        
        // No necesitamos try-catch si las excepciones de la Etapa 1 tienen método render()
        $order = $orderService->createOrder(
            $request->user(), 
            $request->validated()
        );

        return response()->json($order, 201);
    }

    public function show(Order $order)
    {
        // Autorizar (Policy creada en Etapa 2)
        $this->authorize('view', $order);

        if ($cartData['item_count'] === 0) {
            return response()->json(['error' => 'El carrito está vacío.'], 400);
        }

        try {
            $intent = $this->stripeService->createPaymentIntent($cartData['total']);

            return response()->json([
                'clientSecret' => $intent->client_secret,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function create()
    {
        $cartData = $this->cartService->getCart();
        if ($cartData['item_count'] === 0) {
            return redirect()->route('colecciones');
        }

        return Inertia::render('Checkout/Create', [
            'cart' => $cartData['items'],
            'total' => $cartData['total'],
            'user' => Auth::user(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|array',
            'shipping_address.street_address' => 'required|string',
            'shipping_address.city' => 'required|string',
            'shipping_address.postal_code' => 'required|string',
            'shipping_address.country' => 'required|string',
            'payment_method' => 'required|string',
            'payment_intent_id' => 'nullable|string',
            'pickup_point_id' => 'nullable|exists:pickup_points,id',
        ]);

        $cartValidation = $this->cartService->validateCartStock();
        if (! $cartValidation['valid']) {
            return back()->with('error', implode(' ', $cartValidation['errors']));
        }

        $cartData = $this->cartService->getCart();
        if ($cartData['item_count'] === 0) {
            throw new CartEmptyException('checkout');
        }

        try {
            $paymentStatus = 'pending';
            if ($request->payment_intent_id) {
                $intent = $this->stripeService->getPaymentIntent($request->payment_intent_id);
                if ($intent->status === 'succeeded') {
                    $paymentStatus = 'paid';
                }
            }

            DB::transaction(function () use ($request, $cartData, $paymentStatus) {
                $order = Order::create([
                    'user_id' => Auth::id(),
                    'order_number' => 'ORD-'.strtoupper(Str::random(10)),
                    'status' => 'pending',
                    'total_amount' => $cartData['total'],
                    'payment_status' => $paymentStatus,
                    'payment_method' => $request->payment_method,
                    'payment_id' => $request->payment_intent_id,
                    'shipping_address_snapshot' => $request->shipping_address,
                    'billing_address_snapshot' => $request->shipping_address,
                    'pickup_point_id' => $request->pickup_point_id,
                    'notes' => $request->notes ?? null,
                ]);

                foreach ($cartData['items'] as $item) {
                    $product = $item['product'];
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'product_name_snapshot' => $product->name,
                        'sku_snapshot' => $product->sku ?? 'SKU-GENERICO',
                        'quantity' => $item['quantity'],
                        'unit_price' => $product->base_price,
                    ]);
                    $product->decrement('stock_quantity', $item['quantity']);
                }
                $this->cartService->clearCart();
            });

            return redirect()->route('orders.success')->with('success', '¡Pedido realizado con éxito!');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al procesar: '.$e->getMessage());
        }
    }

    public function success()
    {
        return Inertia::render('Checkout/Success');
    }

    public function index()
    {
        $orders = Order::where('user_id', Auth::id())->with('items')->latest()->get();

        return Inertia::render('Profile/Orders', ['orders' => $orders]);
    }
}
