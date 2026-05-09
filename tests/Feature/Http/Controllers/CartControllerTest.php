<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers;

use App\Enums\CouponType;
use App\Enums\ProductType;
use App\Models\Coupon;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_adds_product_to_cart_session(): void
    {
        $product = Product::factory()->simple()->create([
            'slug' => 'cart-add-product',
            'is_active' => true,
            'stock_quantity' => 10,
        ]);

        $this->post(route('cart.add'), [
            'product_slug' => $product->slug,
            'quantity' => 2,
            'accessories' => [],
        ])
            ->assertRedirect()
            ->assertSessionHas('success', 'Producto agregado al carrito');

        $this->assertSame([
            $product->id => [
                'slug' => $product->slug,
                'quantity' => 2,
                'accessories' => [],
                'unit_price' => (float) $product->base_price,
                'line_subtotal' => round((float) $product->base_price * 2, 2),
                'configuration' => null,
            ],
        ], session('shopping_cart'));
    }

    public function test_store_adds_doll_product_to_cart_session(): void
    {
        $product = Product::factory()->doll()->create([
            'slug' => 'queen-doll',
            'is_active' => true,
            'stock_quantity' => 10,
            'base_price' => 3000,
        ]);

        $this->post(route('cart.add'), [
            'product_slug' => $product->slug,
            'quantity' => 1,
            'accessories' => [],
        ])
            ->assertRedirect()
            ->assertSessionHas('success', 'Producto agregado al carrito');

        $this->assertSame(ProductType::Doll->value, $product->product_type);
        $this->assertSame($product->slug, session("shopping_cart.{$product->id}.slug"));
        $this->assertSame(1, session("shopping_cart.{$product->id}.quantity"));
        $this->assertSame(3000.0, session("shopping_cart.{$product->id}.unit_price"));
        $this->assertSame(3000.0, session("shopping_cart.{$product->id}.line_subtotal"));
        $this->assertNull(session("shopping_cart.{$product->id}.configuration"));
    }

    public function test_update_changes_cart_item_quantity_in_session(): void
    {
        $product = Product::factory()->simple()->create([
            'slug' => 'cart-update-product',
            'is_active' => true,
            'stock_quantity' => 10,
        ]);

        $this->withSession([
            'shopping_cart' => [
                $product->id => [
                    'slug' => $product->slug,
                    'quantity' => 1,
                    'accessories' => [],
                ],
            ],
        ])->patch(route('cart.update', $product->id), [
            'quantity' => 4,
        ])
            ->assertRedirect()
            ->assertSessionHas('success', 'Cantidad actualizada');

        $this->assertSame(4, session("shopping_cart.{$product->id}.quantity"));
    }

    public function test_destroy_removes_product_from_cart_session(): void
    {
        $product = Product::factory()->simple()->create([
            'slug' => 'cart-remove-product',
            'is_active' => true,
            'stock_quantity' => 10,
        ]);

        $this->withSession([
            'shopping_cart' => [
                $product->id => [
                    'slug' => $product->slug,
                    'quantity' => 2,
                    'accessories' => [],
                ],
            ],
        ])->delete(route('cart.remove', $product->id))
            ->assertRedirect()
            ->assertSessionHas('success', 'Producto eliminado del carrito');

        $this->assertSame([], session('shopping_cart', []));
    }

    public function test_buy_now_stores_isolated_item_and_redirects_to_buy_now_cart(): void
    {
        $product = Product::factory()->simple()->create([
            'slug' => 'buy-now-product',
            'is_active' => true,
            'stock_quantity' => 10,
        ]);

        $this->post(route('cart.buy-now'), [
            'product_slug' => $product->slug,
            'quantity' => 3,
            'accessories' => [],
        ])
            ->assertRedirect(route('cart.index', ['buy_now' => 1]));

        $this->assertSame([
            'slug' => $product->slug,
            'quantity' => 3,
            'accessories' => [],
            'unit_price' => (float) $product->base_price,
            'line_subtotal' => round((float) $product->base_price * 3, 2),
            'configuration' => null,
        ], session('buy_now_item'));
    }

    public function test_index_recalculates_coupon_discount_using_current_cart_total(): void
    {
        $product = Product::factory()->simple()->create([
            'slug' => 'coupon-cart-product',
            'is_active' => true,
            'stock_quantity' => 10,
            'base_price' => 125,
            'product_type' => ProductType::Simple->value,
        ]);

        Coupon::query()->create([
            'code' => 'SAVE20',
            'type' => CouponType::Percent->value,
            'value' => 20,
            'is_active' => true,
            'expires_at' => now()->addDay(),
        ]);

        $this->withSession([
            'shopping_cart' => [
                $product->id => [
                    'slug' => $product->slug,
                    'quantity' => 2,
                    'accessories' => [],
                ],
            ],
            'coupon' => [
                'code' => 'SAVE20',
                'type' => CouponType::Percent->value,
                'value' => '20.00',
                'discount' => 1.0,
            ],
        ])->get(route('cart.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Checkout/Cart')
                ->where('coupon.code', 'SAVE20')
                ->where('coupon.discount', 50)
                ->where('cart.total', 250)
            );

        $this->assertEquals(50.0, session('coupon.discount'));
    }

    public function test_index_exposes_checkout_step_query_to_cart_page(): void
    {
        $this->get(route('cart.index', ['checkout_step' => 'info']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Checkout/Cart')
                ->where('checkoutStep', 'info')
            );
    }

    public function test_index_removes_coupon_from_session_when_coupon_is_no_longer_valid(): void
    {
        $product = Product::factory()->simple()->create([
            'slug' => 'expired-coupon-product',
            'is_active' => true,
            'stock_quantity' => 10,
            'base_price' => 90,
            'product_type' => ProductType::Simple->value,
        ]);

        Coupon::query()->create([
            'code' => 'OLD10',
            'type' => CouponType::Fixed->value,
            'value' => 10,
            'is_active' => true,
            'expires_at' => now()->subDay(),
        ]);

        $this->withSession([
            'shopping_cart' => [
                $product->id => [
                    'slug' => $product->slug,
                    'quantity' => 1,
                    'accessories' => [],
                ],
            ],
            'coupon' => [
                'code' => 'OLD10',
                'type' => CouponType::Fixed->value,
                'value' => '10.00',
                'discount' => 10.0,
            ],
        ])->get(route('cart.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Checkout/Cart')
                ->where('coupon', null)
            );

        $this->assertFalse(session()->has('coupon'));
    }
}
