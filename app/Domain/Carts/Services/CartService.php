<?php

declare(strict_types=1);

namespace App\Domain\Carts\Services;

use App\Enums\ProductType;
use App\Domain\Dolls\Services\DollCustomizationService;
use App\Domain\Products\Repositories\Interfaces\ProductRepositoryInterface;
use App\Exceptions\InsufficientStockException;
use App\Exceptions\ProductNotFoundException;
use App\Models\Product;
use Illuminate\Support\Facades\Session;

class CartService
{
    protected ProductRepositoryInterface $productRepository;

    protected string $cartSessionKey = 'shopping_cart';

    protected string $buyNowSessionKey = 'buy_now_item';

    public function __construct(
        ProductRepositoryInterface $productRepository,
        private readonly DollCustomizationService $dollCustomizationService,
    ) {
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

        if (empty($cart)) {
            return [
                'items' => [],
                'total' => 0,
                'item_count' => 0,
            ];
        }

        // 1. Recolectar todos los slugs
        $slugs = array_map(function ($item) {
            return $item['slug'];
        }, $cart);

        // 2. Obtener todos los productos en una sola consulta
        $products = $this->productRepository->getActiveBySlugs(array_unique($slugs));
        $productsBySlug = $products->keyBy('slug');

        // 3. Reconstruir el carrito
        foreach ($cart as $productId => $item) {
            // Buscar el producto en la colección cargada
            $product = $productsBySlug->get($item['slug']);

            if ($product) {
                $unitPrice = (float) ($item['unit_price'] ?? $product->base_price);
                $subtotal = (float) ($item['line_subtotal'] ?? ($unitPrice * $item['quantity']));
                $items[] = [
                    'product_id' => $productId,
                    'product' => $product,
                    'quantity' => $item['quantity'],
                    'unit_price' => $unitPrice,
                    'accessories' => $item['accessories'] ?? [],
                    'configuration' => $item['configuration'] ?? null,
                    'subtotal' => $subtotal,
                ];
                $total += $subtotal;
            }
        }

        return [
            'items' => $items,
            'total' => $total,
            'item_count' => count($items),
        ];
    }

    /**
     * Agregar producto al carrito
     */
    public function addToCart(string $productSlug, int $quantity = 1, array $accessories = [], ?array $configuration = null): array
    {
        $product = $this->resolvePurchasableProduct($productSlug, $configuration);

        if (! $product) {
            throw new ProductNotFoundException($productSlug);
        }

        // Validar stock disponible
        if ($product->stock_quantity < $quantity) {
            throw new InsufficientStockException(
                productName: $product->name,
                availableStock: $product->stock_quantity,
                requestedQuantity: $quantity,
                productIdentifier: $product->sku ?? $product->id
            );
        }

        $cart = Session::get($this->cartSessionKey, []);
        $configurationData = $this->resolveConfigurationData((float) $product->base_price, $configuration);
        $itemKey = $this->buildItemKey((string) $product->id, $configurationData['configuration']);

        // Si el producto ya existe, actualizar cantidad
        if (isset($cart[$itemKey])) {
            $newQuantity = $cart[$itemKey]['quantity'] + $quantity;

            // Validar stock total
            if ($product->stock_quantity < $newQuantity) {
                throw new InsufficientStockException(
                    productName: $product->name,
                    availableStock: $product->stock_quantity,
                    requestedQuantity: $newQuantity,
                    productIdentifier: $product->sku ?? $product->id
                );
            }

            $cart[$itemKey]['quantity'] = $newQuantity;
            $cart[$itemKey]['line_subtotal'] = round($cart[$itemKey]['unit_price'] * $newQuantity, 2);
        } else {
            // Agregar nuevo producto
            $cart[$itemKey] = [
                'slug' => $product->slug,
                'quantity' => $quantity,
                'accessories' => $accessories,
                'unit_price' => $configurationData['unit_price'],
                'line_subtotal' => round($configurationData['unit_price'] * $quantity, 2),
                'configuration' => $configurationData['configuration'],
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
            throw new \InvalidArgumentException('La cantidad debe ser al menos 1.');
        }

        $cart = Session::get($this->cartSessionKey, []);

        if (! isset($cart[$productId])) {
            throw new \RuntimeException('Producto no encontrado en el carrito.');
        }

        // Validar stock
        $product = $this->productRepository->getActiveInStockBySlug($cart[$productId]['slug']);
        if ($product && $product->stock_quantity < $quantity) {
            throw new InsufficientStockException(
                productName: $product->name,
                availableStock: $product->stock_quantity,
                requestedQuantity: $quantity,
                productIdentifier: $product->sku ?? $product->id
            );
        }

        $cart[$productId]['quantity'] = $quantity;
        $cart[$productId]['line_subtotal'] = round(((float) ($cart[$productId]['unit_price'] ?? $product->base_price)) * $quantity, 2);
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
            $product = $this->productRepository->getActiveInStockBySlug($item['slug']);

            if (! $product) {
                $errors[] = "Producto {$item['slug']} ya no está disponible.";
            } elseif ($product->stock_quantity < $item['quantity']) {
                $errors[] = "Stock insuficiente para {$product->name}. Disponible: {$product->stock_quantity}";
            }
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
        ];
    }

    /**
     * Establecer el producto para compra directa (Buy Now)
     */
    public function setBuyNowItem(string $productSlug, int $quantity = 1, array $accessories = [], ?array $configuration = null): void
    {
        $product = $this->resolvePurchasableProduct($productSlug, $configuration);

        if (! $product) {
            throw new ProductNotFoundException($productSlug);
        }

        if ($product->stock_quantity < $quantity) {
            throw new InsufficientStockException(
                productName: $product->name,
                availableStock: $product->stock_quantity,
                requestedQuantity: $quantity,
                productIdentifier: $product->sku ?? $product->id
            );
        }

        $configurationData = $this->resolveConfigurationData((float) $product->base_price, $configuration);

        Session::put($this->buyNowSessionKey, [
            'slug' => $productSlug,
            'quantity' => $quantity,
            'accessories' => $accessories,
            'unit_price' => $configurationData['unit_price'],
            'line_subtotal' => round($configurationData['unit_price'] * $quantity, 2),
            'configuration' => $configurationData['configuration'],
        ]);
    }

    /**
     * Obtener el producto de compra directa
     */
    public function getBuyNowItem(): ?array
    {
        $item = Session::get($this->buyNowSessionKey);

        if (! $item) {
            return null;
        }

        $product = $this->productRepository->getActiveInStockBySlug($item['slug']);

        if (! $product) {
            $this->clearBuyNowItem();

            return null;
        }

        $unitPrice = (float) ($item['unit_price'] ?? $product->base_price);
        $subtotal = (float) ($item['line_subtotal'] ?? ($unitPrice * $item['quantity']));

        return [
            'items' => [[
                'product_id' => (string) ($item['item_key'] ?? $product->id),
                'product' => $product,
                'quantity' => $item['quantity'],
                'unit_price' => $unitPrice,
                'accessories' => $item['accessories'] ?? [],
                'configuration' => $item['configuration'] ?? null,
                'subtotal' => $subtotal,
            ]],
            'total' => $subtotal,
            'item_count' => 1,
        ];
    }

    /**
     * Limpiar el producto de compra directa
     */
    public function clearBuyNowItem(): void
    {
        Session::forget($this->buyNowSessionKey);
    }

    public function hasBuyNowItem(): bool
    {
        return Session::has($this->buyNowSessionKey);
    }

    /**
     * @param  array<string, mixed>|null  $configuration
     * @return array{configuration: array<string, mixed>|null, unit_price: float}
     */
    private function resolveConfigurationData(float $basePrice, ?array $configuration): array
    {
        if (! is_array($configuration) || empty($configuration)) {
            return [
                'configuration' => null,
                'unit_price' => round($basePrice, 2),
            ];
        }

        $this->dollCustomizationService->validateConfiguration($configuration);
        $normalizedConfiguration = $this->dollCustomizationService->buildCartConfiguration($configuration);

        return [
            'configuration' => $normalizedConfiguration,
            'unit_price' => $this->dollCustomizationService->calculateUnitPrice($basePrice, $configuration),
        ];
    }

    /**
     * @param  array<string, mixed>|null  $configuration
     */
    private function resolvePurchasableProduct(string $productSlug, ?array $configuration): ?Product
    {
        $product = $this->productRepository->getActiveInStockBySlug($productSlug);

        if (! $product) {
            return null;
        }

        if (
            $product->product_type === ProductType::Configurable->value
            && (! is_array($configuration) || empty($configuration))
        ) {
            throw new \InvalidArgumentException('La muñeca configurable requiere una configuración válida.');
        }

        return $product;
    }

    /**
     * @param  array<string, mixed>|null  $configuration
     */
    private function buildItemKey(string $productId, ?array $configuration): string
    {
        if ($configuration === null) {
            return $productId;
        }

        return sprintf('%s:%s', $productId, md5(json_encode($configuration, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?: $productId));
    }
}
