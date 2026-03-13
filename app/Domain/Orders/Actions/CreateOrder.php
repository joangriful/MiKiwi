<?php

declare(strict_types=1);

namespace App\Domain\Orders\Actions;

use App\Events\OrderCreated;
use App\Exceptions\CartEmptyException;
use App\Exceptions\InsufficientStockException;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\CartService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateOrder
{
    protected CartService $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    public function execute(array $data): Order
    {
        $cart = $this->cartService->getCart();

        if (empty($cart['items'])) {
            throw new CartEmptyException('checkout');
        }

        // Validar stock
        foreach ($cart['items'] as $item) {
            $product = $item['product'];
            if ($product->stock_quantity < $item['quantity']) {
                throw new InsufficientStockException(
                    $product->name,
                    $product->stock_quantity,
                    $item['quantity'],
                    $product->sku ?? $product->id
                );
            }
        }

        return DB::transaction(function () use ($data, $cart) {
            $order = Order::create([
                'user_id' => Auth::id(),
                'order_number' => $this->generateOrderNumber(),
                'status' => 'pending',
                'total_amount' => $cart['total'],
                'payment_status' => 'pending',
                'payment_method' => $data['payment_method'],
                'payment_id' => $data['payment_intent_id'] ?? null,
                'shipping_address_snapshot' => $data['shipping_address'],
                'billing_address_snapshot' => $data['shipping_address'],
                'pickup_point_id' => $data['pickup_point_id'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($cart['items'] as $item) {
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

            event(new OrderCreated($order));

            return $order;
        });
    }

    protected function generateOrderNumber(): string
    {
        return 'MK-'.date('Ymd').'-'.strtoupper(Str::random(6));
    }
}
