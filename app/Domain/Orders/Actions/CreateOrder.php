<?php

declare(strict_types=1);

namespace App\Domain\Orders\Actions;

use App\Domain\Carts\Services\CartService;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Events\OrderCreated;
use App\Exceptions\CartEmptyException;
use App\Exceptions\InsufficientStockException;
use App\Models\Order;
use App\Models\OrderItem;
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
        $isBuyNow = (bool) ($data['is_buy_now'] ?? false);
        $cart = $data['cart'] ?? ($isBuyNow ? $this->cartService->getBuyNowItem() : $this->cartService->getCart());

        if (! $cart || empty($cart['items'])) {
            throw new CartEmptyException('checkout');
        }

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

        return DB::transaction(function () use ($data, $cart, $isBuyNow) {
            $shippingAddress = $this->shippingAddressWithMetadata($data);

            $order = Order::create([
                'user_id' => $data['user_id'] ?? Auth::id(),
                'order_number' => $this->generateOrderNumber(),
                'status' => OrderStatus::Pending->value,
                'total_amount' => $cart['total'],
                'payment_status' => $data['payment_status'] ?? PaymentStatus::Pending->value,
                'payment_method' => $data['payment_method'],
                'shipping_address_snapshot' => $shippingAddress,
                'billing_address_snapshot' => $data['billing_address'] ?? $shippingAddress,
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

            if ($isBuyNow) {
                $this->cartService->clearBuyNowItem();
            } else {
                $this->cartService->clearCart();
            }

            event(new OrderCreated($order));

            return $order;
        });
    }

    protected function generateOrderNumber(): string
    {
        return 'MK-'.date('Ymd').'-'.strtoupper(Str::random(6));
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function shippingAddressWithMetadata(array $data): array
    {
        $shippingAddress = $data['shipping_address'];
        $shippingAddress['metadata'] = [
            'payment_id' => $data['payment_intent_id'] ?? null,
            'pickup_point_id' => $data['pickup_point_id'] ?? null,
            'processed_at' => now()->toDateTimeString(),
        ];

        return $shippingAddress;
    }
}
