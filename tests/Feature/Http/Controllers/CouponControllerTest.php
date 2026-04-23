<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers;

use App\Enums\CouponType;
use App\Models\Coupon;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CouponControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_valid_percent_coupon_is_stored_in_session_with_calculated_discount(): void
    {
        $product = Product::factory()->create([
            'slug' => 'cart-product',
            'is_active' => true,
            'stock_quantity' => 10,
            'base_price' => 100,
        ]);

        Coupon::query()->create([
            'code' => 'SAVE20',
            'type' => CouponType::Percent->value,
            'value' => 20,
            'is_active' => true,
            'expires_at' => now()->addDay(),
        ]);

        $response = $this
            ->withSession([
                'shopping_cart' => [
                    $product->id => [
                        'slug' => $product->slug,
                        'quantity' => 2,
                        'accessories' => [],
                    ],
                ],
            ])
            ->post(route('cart.coupon.apply'), ['code' => 'SAVE20']);

        $response
            ->assertRedirect(route('cart.index'))
            ->assertSessionHas('success', 'Cupón aplicado correctamente.')
            ->assertSessionHas('coupon', [
                'code' => 'SAVE20',
                'type' => CouponType::Percent->value,
                'value' => '20.00',
                'discount' => 40.0,
            ]);
    }

    public function test_expired_coupon_redirects_with_error_and_is_not_stored(): void
    {
        Coupon::query()->create([
            'code' => 'OLD10',
            'type' => CouponType::Fixed->value,
            'value' => 10,
            'is_active' => true,
            'expires_at' => now()->subDay(),
        ]);

        $this->post(route('cart.coupon.apply'), ['code' => 'OLD10'])
            ->assertRedirect(route('cart.index'))
            ->assertSessionHasErrors(['coupon']);

        $this->assertFalse(session()->has('coupon'));
    }

    public function test_missing_coupon_code_is_validated(): void
    {
        $this->post(route('cart.coupon.apply'), ['code' => ''])
            ->assertSessionHasErrors(['code']);
    }

    public function test_coupon_can_be_removed_from_session(): void
    {
        $this
            ->withSession([
                'coupon' => [
                    'code' => 'SAVE20',
                    'type' => CouponType::Percent->value,
                    'value' => 20,
                    'discount' => 5,
                ],
            ])
            ->delete(route('cart.coupon.remove'))
            ->assertRedirect()
            ->assertSessionHas('success', 'Cupón eliminado.');

        $this->assertFalse(session()->has('coupon'));
    }
}
