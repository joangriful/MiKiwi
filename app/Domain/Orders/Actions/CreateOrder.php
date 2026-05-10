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
use App\Models\Product;
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

            $this->assertAccessoryStock($item);
        }

        return DB::transaction(function () use ($data, $cart, $isBuyNow) {
            $userId = (string) ($data['user_id'] ?? Auth::id());
            $shippingAddress = $this->resolveAddress($userId, $data['shipping_address'], 'shipping');
            $billingAddress = $this->resolveAddress($userId, $data['billing_address'] ?? $data['shipping_address'], 'billing');

            $orderItems = [];
            foreach ($cart['items'] as $item) {
                $product = $item['product'];
                $isCustomDoll = ! empty($item['configuration']);
                $orderItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'] ?? $product->base_price,
                    'product_name_snapshot' => $isCustomDoll ? 'Muñeca personalizada' : $product->name,
                    'sku_snapshot' => $product->sku ?? 'SKU-GENERICO',
                    'configuration_snapshot' => $item['configuration'] ?? null,
                    'accessories' => $this->buildOrderItemAccessories($item),
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

                $this->decrementAccessoryStock($item);
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

    private function shouldValidateStock(Product $product): bool
    {
        return $product->product_type !== ProductType::Configurable->value;
    }

    /**
     * @param  array<string, mixed>  $item
     */
    private function assertAccessoryStock(array $item): void
    {
        foreach (($item['accessories'] ?? []) as $accessory) {
            if (! is_array($accessory)) {
                continue;
            }

            $product = $this->resolveAccessoryProduct($accessory);
            $requiredQuantity = $this->accessoryRequiredQuantity($item, $accessory);

            if ($product->stock_quantity < $requiredQuantity) {
                throw new InsufficientStockException(
                    $product->name,
                    $product->stock_quantity,
                    $requiredQuantity,
                    $product->sku ?? $product->id
                );
            }
        }
    }

    /**
     * @param  array<string, mixed>  $item
     * @return array<int, array<string, mixed>>
     */
    private function buildOrderItemAccessories(array $item): array
    {
        $accessories = [];

        foreach (($item['accessories'] ?? []) as $accessory) {
            if (! is_array($accessory)) {
                continue;
            }

            $product = $this->resolveAccessoryProduct($accessory);

            $accessories[] = [
                'product_id' => $product->id,
                'product_name_snapshot' => $product->name,
                'sku_snapshot' => $product->sku ?? 'SKU-GENERICO',
                'category' => $accessory['category'] ?? null,
                'view' => $accessory['view'] ?? null,
                'unit_price' => $accessory['unit_price'] ?? $product->base_price,
                'quantity' => $this->accessoryRequiredQuantity($item, $accessory),
                'visual_data_snapshot' => $accessory['visual_data_snapshot'] ?? null,
            ];
        }

        return $accessories;
    }

    /**
     * @param  array<string, mixed>  $item
     */
    private function decrementAccessoryStock(array $item): void
    {
        foreach (($item['accessories'] ?? []) as $accessory) {
            if (! is_array($accessory)) {
                continue;
            }

            $product = $this->resolveAccessoryProduct($accessory);
            $product->decrement('stock_quantity', $this->accessoryRequiredQuantity($item, $accessory));
        }
    }

    /**
     * @param  array<string, mixed>  $item
     * @param  array<string, mixed>  $accessory
     */
    private function accessoryRequiredQuantity(array $item, array $accessory): int
    {
        return (int) ($item['quantity'] ?? 1) * (int) ($accessory['quantity'] ?? 1);
    }

    /**
     * @param  array<string, mixed>  $accessory
     */
    private function resolveAccessoryProduct(array $accessory): Product
    {
        $productId = (string) ($accessory['product_id'] ?? '');

        if ($productId === '') {
            throw new \InvalidArgumentException('El accesorio seleccionado no tiene producto asociado.');
        }

        return Product::query()
            ->where('product_type', ProductType::Accessory->value)
            ->findOrFail($productId);
    }
}
