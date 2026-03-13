<?php

declare(strict_types=1);

namespace App\Domain\Orders\Services;

use App\Exceptions\CartEmptyException;
use App\Exceptions\InvalidOrderException;
use App\Domain\Orders\Actions\CreateOrder;
use App\Domain\Orders\Repositories\Interfaces\OrderRepositoryInterface;
use App\Domain\Products\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Support\Str;

class OrderService
{
    protected OrderRepositoryInterface $orderRepository;

    protected ProductRepositoryInterface $productRepository;

    protected CartService $cartService;

    // Inyección de dependencia de la Acción
    public function __construct(CreateOrder $createOrderAction)
    {
        $this->createOrderAction = $createOrderAction;
    }

    /**
     * Crear pedido desde el carrito
     */
    public function createOrderFromCart(string $userId, array $shippingAddress, ?array $billingAddress = null, string $paymentMethod = 'pending'): array
    {
        // Validar que el carrito tenga productos
        $cart = $this->cartService->getCart();

        if (empty($cart['items'])) {
            throw new CartEmptyException('checkout');
        }

        // Validar stock de todos los productos
        $stockValidation = $this->cartService->validateCartStock();
        if (! $stockValidation['valid']) {
            throw new \RuntimeException('Error de stock: '.implode(', ', $stockValidation['errors']));
        }

        // Generar número de pedido único
        $orderNumber = $this->generateOrderNumber();

        // Preparar items del pedido
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

        // Crear el pedido
        $order = $this->orderRepository->create([
            'user_id' => $userId,
            'order_number' => $orderNumber,
            'status' => 'pending',
            'total_amount' => $totalAmount,
            'payment_status' => 'pending',
            'payment_method' => $paymentMethod,
            'shipping_address_snapshot' => $shippingAddress,
            'billing_address_snapshot' => $billingAddress ?? $shippingAddress,
            'items' => $orderItems,
        ]);

        // Reducir stock de productos
        foreach ($cart['items'] as $item) {
            $item['product']->decrement('stock_quantity', $item['quantity']);
        }

        // Vaciar el carrito
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
    public function getUserOrders(string $userId, int $perPage = 10)
    {
        return $this->orderRepository->getUserOrders($userId, $perPage);
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
        $validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

        if (! in_array($status, $validStatuses)) {
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
    protected function calculateOrderTotal(array $items): float
    {
        $total = 0;

        foreach ($items as $item) {
            $total += $item['subtotal'];
        }

        // Aquí se podrían aplicar descuentos, cupones, etc.

        return $total;
    }

    /**
     * Obtener pedidos recientes (para admin)
     */
    public function getRecentOrders(int $limit = 10)
    {
        return $this->orderRepository->getRecentOrders($limit);
    }
}
