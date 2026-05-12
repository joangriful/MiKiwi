<?php

declare(strict_types=1);

namespace Tests\Feature\Services;

use App\Domain\Carts\Services\CartService;
use App\Enums\ProductType;
use App\Exceptions\InsufficientStockException;
use App\Exceptions\ProductNotFoundException;
use App\Models\Product;
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

    public function test_can_add_ready_made_doll_to_cart(): void
    {
        $product = Product::factory()->doll()->create([
            'slug' => 'queen-doll',
            'stock_quantity' => 10,
            'is_active' => true,
            'base_price' => 3000,
        ]);

        $cart = $this->cartService->addToCart($product->slug, 1);

        $this->assertCount(1, $cart['items']);
        $this->assertSame(ProductType::Doll->value, $cart['items'][0]['product']->product_type);
        $this->assertSame($product->slug, $cart['items'][0]['product']->slug);
        $this->assertEquals(1, $cart['items'][0]['quantity']);
        $this->assertEquals(3000.0, $cart['items'][0]['unit_price']);
        $this->assertNull($cart['items'][0]['configuration']);
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
