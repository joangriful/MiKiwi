<?php

declare(strict_types=1);

namespace Tests\Feature\Services;

use App\Domain\Coupons\Services\CouponService;
use App\Enums\CouponType;
use App\Models\Coupon;
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
}
