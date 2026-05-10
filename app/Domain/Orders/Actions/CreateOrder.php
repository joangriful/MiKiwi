<?php

declare(strict_types=1);

namespace App\Domain\Orders\Actions;

use App\Domain\Carts\Services\CartService;
use App\Domain\Orders\Repositories\Interfaces\OrderRepositoryInterface;
use App\Enums\ProductType;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Events\OrderCreated;
use App\Exceptions\CartEmptyException;
use App\Exceptions\InsufficientStockException;
use App\Models\Address;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateOrder
{
    public function __construct(
        private readonly CartService $cartService,
        private readonly OrderRepositoryInterface $orderRepository,
    ) {}

    public function execute(array $data): Order
    {
        $isBuyNow = (bool) ($data['is_buy_now'] ?? false);
        $cart = $data['cart'] ?? ($isBuyNow ? $this->cartService->getBuyNowItem() : $this->cartService->getCart());

        if (! $cart || empty($cart['items'])) {
            throw new CartEmptyException('checkout');
        }

        foreach ($cart['items'] as $item) {
            $product = $item['product'];
            if ($this->shouldValidateStock($product) && $product->stock_quantity < $item['quantity']) {
                throw new InsufficientStockException(
                    $product->name,
                    $product->stock_quantity,
                    $item['quantity'],
                    $product->sku ?? $product->id
                );
            }
        }

        return DB::transaction(function () use ($data, $cart, $isBuyNow) {
            $userId = (string) ($data['user_id'] ?? Auth::id());
            $shippingAddress = $this->resolveAddress($userId, $data['shipping_address'], 'shipping');
            $billingAddress = $this->resolveAddress($userId, $data['billing_address'] ?? $data['shipping_address'], 'billing');

            $orderItems = [];
            foreach ($cart['items'] as $item) {
                $product = $item['product'];
                $orderItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'] ?? $product->base_price,
                    'product_name_snapshot' => ! empty($item['configuration']) ? $product->name.' - Configuracion personalizada' : $product->name,
                    'sku_snapshot' => $product->sku ?? 'SKU-GENERICO',
                ];
            }

            $order = $this->orderRepository->create([
                'user_id' => $userId,
                'shipping_address_id' => $shippingAddress->id,
                'billing_address_id' => $billingAddress->id,
                'coupon_id' => $data['coupon_id'] ?? null,
                'order_number' => $this->generateOrderNumber(),
                'status' => OrderStatus::Pending->value,
                'total_amount' => $cart['total'],
                'payment_status' => $data['payment_status'] ?? PaymentStatus::Pending->value,
                'payment_method' => $data['payment_method'],
                'notes' => $data['notes'] ?? null,
                'items' => $orderItems,
            ]);

            foreach ($cart['items'] as $item) {
                $product = $item['product'];
                if ($this->shouldValidateStock($product)) {
                    $product->decrement('stock_quantity', $item['quantity']);
                }
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
     * @param  array<string, mixed>  $addressData
     */
    private function resolveAddress(string $userId, array $addressData, string $alias): Address
    {
        if (isset($addressData['id']) && is_string($addressData['id'])) {
            $existingAddress = Address::query()
                ->where('id', $addressData['id'])
                ->where('user_id', $userId)
                ->first();

            if ($existingAddress) {
                return $existingAddress;
            }
        }

        $user = User::query()->findOrFail($userId);

        return Address::query()->create([
            'user_id' => $user->id,
            'alias' => $addressData['alias'] ?? $alias,
            'full_name' => $addressData['full_name'] ?? $user->name,
            'phone' => $addressData['phone'] ?? null,
            'street_address' => $addressData['street_address'] ?? '',
            'city' => $addressData['city'] ?? '',
            'postal_code' => $addressData['postal_code'] ?? '',
            'country' => $addressData['country'] ?? 'ES',
            'is_default' => false,
        ]);
    }

    private function shouldValidateStock($product): bool
    {
        return $product->product_type !== ProductType::Configurable->value;
    }
}
