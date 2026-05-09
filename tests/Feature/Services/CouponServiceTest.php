<?php

declare(strict_types=1);

namespace Tests\Feature\Services;

use App\Domain\Coupons\Services\CouponService;
use App\Enums\CouponType;
use App\Enums\ProductType;
use App\Exceptions\InvalidCouponException;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Session;
use Tests\TestCase;

class CouponServiceTest extends TestCase
{
    use RefreshDatabase;

    protected CouponService $couponService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->couponService = app(CouponService::class);
        Session::start();
    }

    public function test_refresh_session_coupon_recalculates_discount_with_current_total(): void
    {
        Coupon::query()->create([
            'code' => 'SAVE20',
            'type' => CouponType::Percent->value,
            'value' => 20,
            'is_active' => true,
            'expires_at' => now()->addDay(),
        ]);

        session([
            'coupon' => [
                'code' => 'SAVE20',
                'type' => CouponType::Percent->value,
                'value' => '20.00',
                'discount' => 10.0,
            ],
        ]);

        $coupon = $this->couponService->refreshSessionCoupon(250);

        $this->assertSame('SAVE20', $coupon['code']);
        $this->assertSame(50.0, $coupon['discount']);
        $this->assertSame(50.0, session('coupon.discount'));
    }

    public function test_refresh_session_coupon_removes_invalid_coupon_from_session(): void
    {
        Coupon::query()->create([
            'code' => 'OLD10',
            'type' => CouponType::Fixed->value,
            'value' => 10,
            'is_active' => true,
            'expires_at' => now()->subDay(),
        ]);

        session([
            'coupon' => [
                'code' => 'OLD10',
                'type' => CouponType::Fixed->value,
                'value' => '10.00',
                'discount' => 10.0,
            ],
        ]);

        $coupon = $this->couponService->refreshSessionCoupon(100);

        $this->assertNull($coupon);
        $this->assertFalse(session()->has('coupon'));
    }

    public function test_apply_coupon_rejects_cart_below_minimum_amount(): void
    {
        Coupon::query()->create([
            'code' => 'KIWI15',
            'type' => CouponType::Percent->value,
            'value' => 15,
            'minimum_amount' => 75,
            'is_active' => true,
            'expires_at' => now()->addDay(),
        ]);

        $this->expectException(InvalidCouponException::class);
        $this->expectExceptionMessage('Este cupón requiere un pedido mínimo de 75.00 €.');

        $this->couponService->applyCoupon('KIWI15', 50, [
            'items' => [],
            'total' => 50,
        ]);
    }

    public function test_apply_coupon_rejects_cart_without_required_product_type(): void
    {
        $product = Product::factory()->simple()->create();

        Coupon::query()->create([
            'code' => 'DOLL20',
            'type' => CouponType::Percent->value,
            'value' => 20,
            'minimum_amount' => 3200,
            'required_product_type' => ProductType::Doll->value,
            'is_active' => true,
            'expires_at' => now()->addDay(),
        ]);

        $this->expectException(InvalidCouponException::class);
        $this->expectExceptionMessage('Este cupón no se puede aplicar a los productos del carrito.');

        $this->couponService->applyCoupon('DOLL20', 3200, [
            'items' => [[
                'product' => $product,
                'quantity' => 1,
                'subtotal' => 3200,
            ]],
            'total' => 3200,
        ]);
    }

    public function test_apply_coupon_accepts_required_product_type_when_cart_contains_it(): void
    {
        $product = Product::factory()->doll()->create();

        Coupon::query()->create([
            'code' => 'DOLL20',
            'type' => CouponType::Percent->value,
            'value' => 20,
            'minimum_amount' => 3200,
            'required_product_type' => ProductType::Doll->value,
            'is_active' => true,
            'expires_at' => now()->addDay(),
        ]);

        $coupon = $this->couponService->applyCoupon('DOLL20', 3200, [
            'items' => [[
                'product' => $product,
                'quantity' => 1,
                'subtotal' => 3200,
            ]],
            'total' => 3200,
        ]);

        $this->assertSame('DOLL20', $coupon['code']);
        $this->assertSame(640.0, $coupon['discount']);
    }

    public function test_apply_coupon_rejects_first_order_coupon_for_existing_customer(): void
    {
        $user = User::factory()->create();
        Order::factory()->create(['user_id' => $user->getKey()]);

        Coupon::query()->create([
            'code' => 'BIENVENIDA10',
            'type' => CouponType::Percent->value,
            'value' => 10,
            'first_order_only' => true,
            'is_active' => true,
            'expires_at' => now()->addDay(),
        ]);

        $this->expectException(InvalidCouponException::class);
        $this->expectExceptionMessage('Este cupón solo es válido para el primer pedido.');

        $this->couponService->applyCoupon('BIENVENIDA10', 100, [
            'items' => [],
            'total' => 100,
        ], (string) $user->getKey());
    }

    public function test_payable_total_subtracts_valid_session_coupon_discount(): void
    {
        Coupon::query()->create([
            'code' => 'SAVE20',
            'type' => CouponType::Percent->value,
            'value' => 20,
            'is_active' => true,
            'expires_at' => now()->addDay(),
        ]);

        session([
            'coupon' => [
                'code' => 'SAVE20',
            ],
        ]);

        $total = $this->couponService->payableTotal([
            'items' => [],
            'total' => 250,
        ]);

        $this->assertSame(200.0, $total);
        $this->assertSame(50.0, session('coupon.discount'));
    }
}
