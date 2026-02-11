<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Services\StripeService;

class OrderController extends Controller
{
    protected $cartService;
    protected $stripeService;

    public function __construct(CartService $cartService, StripeService $stripeService)
    {
        $this->cartService = $cartService;
        $this->stripeService = $stripeService;
    }

    /**
     * Create a Stripe PaymentIntent
     */
    public function createPaymentIntent()
    {
        $cartData = $this->cartService->getCart();

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
            'dni' => 'required|string',
            'billing_address' => 'nullable|array',
            'payment_method' => 'required|string',
            'payment_intent_id' => 'nullable|string',
            'pickup_point_id' => 'nullable|exists:pickup_points,id',
        ]);

        $cartValidation = $this->cartService->validateCartStock();
        if (!$cartValidation['valid']) {
            return back()->with('error', implode(' ', $cartValidation['errors']));
        }

        $cartData = $this->cartService->getCart();
        if ($cartData['item_count'] === 0) {
            return back()->with('error', 'El carrito está vacío.');
        }

        try {
            $paymentStatus = 'pending';
            if ($request->payment_intent_id) {
                $intent = $this->stripeService->getPaymentIntent($request->payment_intent_id);
                if ($intent->status === 'succeeded') {
                    $paymentStatus = 'paid';
                }
            }

            $totalAmount = $cartData['total'];
            $coupon = session('coupon');
            if ($coupon) {
                $totalAmount = max(0, $totalAmount - $coupon['discount']);
            }

            DB::transaction(function () use ($request, $cartData, $paymentStatus, $totalAmount) {
                $shippingSnapshot = $request->shipping_address;
                $shippingSnapshot['dni'] = $request->dni;

                $order = Order::create([
                    'user_id' => Auth::id(),
                    'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                    'status' => 'pending',
                    'total_amount' => $totalAmount,
                    'payment_status' => $paymentStatus,
                    'payment_method' => $request->payment_method,
                    'payment_id' => $request->payment_intent_id,
                    'shipping_address_snapshot' => $shippingSnapshot,
                    'billing_address_snapshot' => $request->billing_address ?? $shippingSnapshot,
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
            return back()->with('error', 'Error al procesar: ' . $e->getMessage());
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
