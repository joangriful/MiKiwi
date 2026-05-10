<?php

declare(strict_types=1);

namespace App\Domain\Orders\Services;

use App\Domain\Carts\Services\CartService;
use App\Domain\Orders\Repositories\Interfaces\OrderRepositoryInterface;
use App\Models\Address;
use App\Models\User;
use App\Enums\ProductType;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Exceptions\CartEmptyException;
use App\Exceptions\InvalidOrderException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $orderRepository,
        private readonly CartService $cartService,
    ) {}

    /**
     * Crear pedido desde el carrito
     */
    public function createOrderFromCart(string $userId, array $shippingAddress, ?array $billingAddress = null, string $paymentMethod = 'pending'): array
    {
        $cart = $this->cartService->getCart();

        if (empty($cart['items'])) {
            throw new CartEmptyException('checkout');
        }

        $stockValidation = $this->cartService->validateCartStock();
        if (! $stockValidation['valid']) {
            throw new \RuntimeException('Error de stock: '.implode(', ', $stockValidation['errors']));
        }

        $orderNumber = $this->generateOrderNumber();

        $orderItems = [];
        $totalAmount = 0;

        foreach ($cart['items'] as $item) {
            $product = $item['product'];
            $subtotal = $product->base_price * $item['quantity'];

            $orderItems[] = [
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'unit_price' => $product->base_price,
                'subtotal' => $subtotal,
                'product_name_snapshot' => $product->name,
                'sku_snapshot' => $product->sku ?? 'SKU-GENERICO',
            ];

            $totalAmount += $subtotal;
        }

        $shippingAddressRecord = $this->resolveAddressRecord($userId, $shippingAddress, 'shipping');
        $billingAddressRecord = $this->resolveAddressRecord($userId, $billingAddress ?? $shippingAddress, 'billing');

        $order = $this->orderRepository->create([
            'user_id' => $userId,
            'shipping_address_id' => $shippingAddressRecord->id,
            'billing_address_id' => $billingAddressRecord->id,
            'order_number' => $orderNumber,
            'status' => OrderStatus::Pending->value,
            'total_amount' => $totalAmount,
            'payment_status' => PaymentStatus::Pending->value,
            'payment_method' => $paymentMethod,
            'items' => $orderItems,
        ]);

        foreach ($cart['items'] as $item) {
            if ($this->shouldValidateStock($item['product'])) {
                $item['product']->decrement('stock_quantity', $item['quantity']);
            }
        }

        $this->cartService->clearCart();

        return [
            'success' => true,
            'order' => $order,
            'order_number' => $orderNumber,
        ];
    }

    /**
     * Obtener pedidos de un usuario
     */
    public function getUserOrders(string $userId, int $perPage = 10): LengthAwarePaginator
    {
        return $this->orderRepository->getUserOrders($userId, $perPage);
    }

    public function getLatestUserOrders(string $userId): Collection
    {
        return $this->orderRepository->getLatestUserOrders($userId);
    }

    /**
     * Obtener detalles de un pedido
     */
    public function getOrderDetails(string $orderNumber): array
    {
        $order = $this->orderRepository->findByOrderNumber($orderNumber);

        if (! $order) {
            throw new InvalidOrderException('not_found', $orderNumber);
        }

        return [
            'order' => $order,
            'items' => $order->items,
            'user' => $order->user,
        ];
    }

    /**
     * Actualizar estado de un pedido
     */
    public function updateOrderStatus(string $orderId, string $status): bool
    {
        if (! in_array($status, OrderStatus::values(), true)) {
            throw new InvalidOrderException('invalid_status');
        }

        return $this->orderRepository->updateStatus($orderId, $status);
    }

    /**
     * Generar número de pedido único
     */
    protected function generateOrderNumber(): string
    {
        do {
            $orderNumber = 'MK-'.date('Ymd').'-'.strtoupper(Str::random(6));
            $exists = $this->orderRepository->findByOrderNumber($orderNumber);
        } while ($exists);

        return $orderNumber;
    }

    /**
     * Calcular total de un pedido (con posibles descuentos futuros)
     */
    public function getRecentOrders(int $limit = 10): Collection
    {
        return $this->orderRepository->getRecentOrders($limit);
    }

    /**
     * @param  array<string, mixed>  $addressData
     */
    private function resolveAddressRecord(string $userId, array $addressData, string $alias): Address
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

        return DB::transaction(function () use ($user, $addressData, $alias) {
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
        });
    }

    private function shouldValidateStock($product): bool
    {
        return $product->product_type !== ProductType::Configurable->value;
    }
}
