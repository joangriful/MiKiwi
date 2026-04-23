<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Domain\Carts\Services\CartService;
use App\Domain\Orders\Actions\CancelOrder;
use App\Domain\Orders\Actions\CreateOrder;
use App\Domain\Orders\Actions\ResolveOrderPaymentStatus;
use App\Domain\Orders\Services\OrderService;
use App\Domain\Payments\Services\StripeService;
use App\Exceptions\InvalidOrderException;
use App\Http\Controllers\Concerns\InteractsWithApiErrors;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class OrderController extends Controller
{
    use InteractsWithApiErrors;

    public function __construct(
        protected CartService $cartService,
        protected StripeService $stripeService,
        private readonly CreateOrder $createOrder,
        private readonly CancelOrder $cancelOrder,
        private readonly ResolveOrderPaymentStatus $resolvePaymentStatus,
        private readonly OrderService $orderService,
    ) {}

    public function show(Order $order)
    {
        // Autorizar (Policy creada en Etapa 2)
        $this->authorize('view', $order);

        return Inertia::render('Profile/OrderShow', [
            'order' => $order->load('items.product'),
        ]);
    }

    public function create()
    {
        $cartData = $this->cartService->getCart();
        if ($cartData['item_count'] === 0) {
            return redirect()->route('colecciones');
        }

        return Inertia::render('Checkout/Cart', [
            'cart' => $cartData,
            'user' => Auth::user(),
        ]);
    }

    public function store(StoreOrderRequest $request)
    {
        $cartValidation = $this->cartService->validateCartStock();
        if (! $cartValidation['valid']) {
            throw ValidationException::withMessages([
                'checkout' => implode(' ', $cartValidation['errors']),
            ]);
        }

        $isBuyNow = session()->has('buy_now_item');
        $cartData = $isBuyNow ? $this->cartService->getBuyNowItem() : $this->cartService->getCart();

        if (! $cartData || $cartData['item_count'] === 0) {
            throw ValidationException::withMessages([
                'checkout' => 'Tu carrito está vacío. Añade al menos un producto antes de continuar con el pago.',
            ]);
        }

        try {
            $validated = $request->validated();
            $validated['cart'] = $cartData;
            $validated['is_buy_now'] = $isBuyNow;
            $validated['payment_status'] = $this->resolvePaymentStatus->execute($validated['payment_intent_id'] ?? null);

            $this->createOrder->execute($validated);

            return redirect()->route('orders.success')->with('success', '¡Pedido realizado con éxito!');
        } catch (\Throwable $exception) {
            Log::error('Order creation failed: '.$exception->getMessage());

            throw ValidationException::withMessages([
                'checkout' => 'No pudimos guardar tu pedido. Si el cargo se ha realizado, contacta con soporte con tu referencia de pago.',
            ]);
        }
    }

    public function success()
    {
        return Inertia::render('Checkout/Success');
    }

    public function createPaymentIntent(Request $request)
    {
        try {
            $isBuyNow = session()->has('buy_now_item');
            $cartData = $isBuyNow ? $this->cartService->getBuyNowItem() : $this->cartService->getCart();

            if ($cartData['item_count'] === 0) {
                return $this->apiError(
                    'checkout_cart_empty',
                    'Tu carrito está vacío. Añade al menos un producto antes de continuar con el pago.',
                    422
                );
            }

            $user = Auth::user();
            $customer = $this->stripeService->getOrCreateCustomer($user);

            $intent = $this->stripeService->createPaymentIntent(
                $cartData['total'],
                'eur',
                ['order_type' => $isBuyNow ? 'buy_now' : 'standard'],
                $customer->id
            );

            return response()->json([
                'clientSecret' => $intent->client_secret,
            ]);
        } catch (\Throwable $exception) {
            Log::error('Payment intent creation failed: '.$exception->getMessage());

            return $this->apiError(
                'checkout_payment_intent_failed',
                'No pudimos iniciar el pago seguro. Inténtalo de nuevo en unos minutos.',
                500
            );
        }
    }

    public function index()
    {
        $orders = $this->orderService->getLatestUserOrders(Auth::id());

        return Inertia::render('Profile/Orders', ['orders' => $orders]);
    }

    public function cancel(Request $request, Order $order)
    {
        $this->authorize('view', $order);

        try {
            $this->cancelOrder->execute($order, $request->string('reason')->toString());
        } catch (InvalidOrderException) {
            return back()->with('error', 'Este pedido no puede cancelarse.');
        }

        return back()->with('success', 'Pedido cancelado correctamente.');
    }
}
