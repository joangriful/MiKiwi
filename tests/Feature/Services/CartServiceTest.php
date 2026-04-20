<?php

declare(strict_types=1);

namespace Tests\Feature\Services;

use App\Exceptions\InsufficientStockException;
use App\Exceptions\ProductNotFoundException;
use App\Models\Product;
use App\Domain\Carts\Services\CartService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Session;
use Tests\TestCase;

class CartServiceTest extends TestCase
{
    use RefreshDatabase;

    protected CartService $cartService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->cartService = app(CartService::class);
        Session::start();
    }

    public function test_can_add_product_to_cart(): void
    {
        $product = Product::factory()->create([
            'stock_quantity' => 10,
            'is_active' => true,
        ]);

        $cart = $this->cartService->addToCart($product->slug, 2);

        $this->assertCount(1, $cart['items']);
        $this->assertEquals(2, $cart['items'][0]['quantity']);
    }

    public function test_cannot_add_more_than_available_stock(): void
    {
        $product = Product::factory()->create([
            'stock_quantity' => 5,
            'is_active' => true,
        ]);

        $this->expectException(InsufficientStockException::class);
        $this->cartService->addToCart($product->slug, 10);
    }

    public function test_cannot_add_inactive_product(): void
    {
        $product = Product::factory()->create([
            'is_active' => false,
        ]);

        $this->expectException(ProductNotFoundException::class);
        $this->cartService->addToCart($product->slug, 1);
    }

    public function test_can_update_quantity(): void
    {
        $product = Product::factory()->create([
            'stock_quantity' => 10,
            'is_active' => true,
        ]);

        $this->cartService->addToCart($product->slug, 1);
        $cart = $this->cartService->updateQuantity($product->id, 3);

        $this->assertEquals(3, $cart['items'][0]['quantity']);
    }

    public function test_can_remove_product_from_cart(): void
    {
        $product = Product::factory()->create([
            'stock_quantity' => 10,
            'is_active' => true,
        ]);

        $this->cartService->addToCart($product->slug, 1);
        $cart = $this->cartService->removeFromCart($product->id);

        $this->assertCount(0, $cart['items']);
    }

    public function test_can_clear_cart(): void
    {
        $product = Product::factory()->create([
            'stock_quantity' => 10,
            'is_active' => true,
        ]);

        $this->cartService->addToCart($product->slug, 1);
        $this->cartService->clearCart();
        $cart = $this->cartService->getCart();

        $this->assertCount(0, $cart['items']);
    }

    public function test_validates_cart_stock(): void
    {
        $product = Product::factory()->create([
            'stock_quantity' => 5,
            'is_active' => true,
        ]);

        // Add to cart with available stock
        $this->cartService->addToCart($product->slug, 3);

        // Reduce stock in database
        $product->update(['stock_quantity' => 2]);

        $validation = $this->cartService->validateCartStock();

        $this->assertFalse($validation['valid']);
        $this->assertNotEmpty($validation['errors']);
    }
}
