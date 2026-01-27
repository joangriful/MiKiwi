<?php

namespace App\Services;

use App\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Support\Facades\Session;

class CartService
{
    protected $productRepository;
    protected $cartSessionKey = 'shopping_cart';

    public function __construct(ProductRepositoryInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    /**
     * Obtener el contenido del carrito
     */
    public function getCart(): array
    {
        $cart = Session::get($this->cartSessionKey, []);
        $items = [];
        $total = 0;

        foreach ($cart as $productId => $item) {
            // Obtener datos actualizados del producto
            $product = $this->productRepository->getActiveBySlug($item['slug']);
            
            if ($product) {
                $subtotal = $product->base_price * $item['quantity'];
                $items[] = [
                    'product_id' => $productId,
                    'product' => $product,
                    'quantity' => $item['quantity'],
                    'accessories' => $item['accessories'] ?? [],
                    'subtotal' => $subtotal
                ];
                $total += $subtotal;
            }
        }

        return [
            'items' => $items,
            'total' => $total,
            'item_count' => count($items)
        ];
    }

    /**
     * Agregar producto al carrito
     */
    public function addToCart(string $productSlug, int $quantity = 1, array $accessories = []): array
    {
        $product = $this->productRepository->getActiveBySlug($productSlug);

        if (!$product) {
            throw new \Exception("Producto no encontrado o inactivo.");
        }

        // Validar stock disponible
        if ($product->stock_quantity < $quantity) {
            throw new \Exception("Stock insuficiente. Disponible: {$product->stock_quantity}");
        }

        $cart = Session::get($this->cartSessionKey, []);

        // Si el producto ya existe, actualizar cantidad
        if (isset($cart[$product->id])) {
            $newQuantity = $cart[$product->id]['quantity'] + $quantity;
            
            // Validar stock total
            if ($product->stock_quantity < $newQuantity) {
                throw new \Exception("Stock insuficiente. Disponible: {$product->stock_quantity}");
            }
            
            $cart[$product->id]['quantity'] = $newQuantity;
        } else {
            // Agregar nuevo producto
            $cart[$product->id] = [
                'slug' => $product->slug,
                'quantity' => $quantity,
                'accessories' => $accessories
            ];
        }

        Session::put($this->cartSessionKey, $cart);

        return $this->getCart();
    }

    /**
     * Actualizar cantidad de un producto
     */
    public function updateQuantity(string $productId, int $quantity): array
    {
        if ($quantity < 1) {
            throw new \Exception("La cantidad debe ser al menos 1.");
        }

        $cart = Session::get($this->cartSessionKey, []);

        if (!isset($cart[$productId])) {
            throw new \Exception("Producto no encontrado en el carrito.");
        }

        // Validar stock
        $product = $this->productRepository->getActiveBySlug($cart[$productId]['slug']);
        if ($product && $product->stock_quantity < $quantity) {
            throw new \Exception("Stock insuficiente. Disponible: {$product->stock_quantity}");
        }

        $cart[$productId]['quantity'] = $quantity;
        Session::put($this->cartSessionKey, $cart);

        return $this->getCart();
    }

    /**
     * Eliminar producto del carrito
     */
    public function removeFromCart(string $productId): array
    {
        $cart = Session::get($this->cartSessionKey, []);

        if (isset($cart[$productId])) {
            unset($cart[$productId]);
            Session::put($this->cartSessionKey, $cart);
        }

        return $this->getCart();
    }

    /**
     * Vaciar el carrito
     */
    public function clearCart(): void
    {
        Session::forget($this->cartSessionKey);
    }

    /**
     * Obtener número de items en el carrito
     */
    public function getItemCount(): int
    {
        $cart = Session::get($this->cartSessionKey, []);
        return array_sum(array_column($cart, 'quantity'));
    }

    /**
     * Validar disponibilidad de todos los productos del carrito
     */
    public function validateCartStock(): array
    {
        $cart = Session::get($this->cartSessionKey, []);
        $errors = [];

        foreach ($cart as $productId => $item) {
            $product = $this->productRepository->getActiveBySlug($item['slug']);
            
            if (!$product) {
                $errors[] = "Producto {$item['slug']} ya no está disponible.";
            } elseif ($product->stock_quantity < $item['quantity']) {
                $errors[] = "Stock insuficiente para {$product->name}. Disponible: {$product->stock_quantity}";
            }
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
}
