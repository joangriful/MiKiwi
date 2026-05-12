<?php

declare(strict_types=1);

namespace Tests\Feature\Models;

use App\Domain\Coupons\Actions\CalculateCouponDiscount;
use App\Domain\Coupons\Actions\ValidateCoupon;
use App\Enums\CouponType;
use App\Models\Coupon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CouponTest extends TestCase
{
    use RefreshDatabase;

    protected ValidateCoupon $validateCoupon;

    protected CalculateCouponDiscount $calculateCouponDiscount;

    protected function setUp(): void
    {
        parent::setUp();

        $this->validateCoupon = app(ValidateCoupon::class);
        $this->calculateCouponDiscount = app(CalculateCouponDiscount::class);
    }

    public function test_active_non_expired_coupon_is_valid(): void
    {
        $coupon = Coupon::query()->create([
            'code' => 'VALID10',
            'type' => CouponType::Percent->value,
            'value' => 10,
            'is_active' => true,
            'expires_at' => now()->addDay(),
        ]);

        $this->assertTrue($this->validateCoupon->execute($coupon));
    }

    public function test_inactive_or_expired_coupon_is_not_valid(): void
    {
        $inactiveCoupon = Coupon::query()->create([
            'code' => 'INACTIVE10',
            'type' => CouponType::Percent->value,
            'value' => 10,
            'is_active' => false,
            'expires_at' => now()->addDay(),
        ]);

        $expiredCoupon = Coupon::query()->create([
            'code' => 'EXPIRED10',
            'type' => CouponType::Fixed->value,
            'value' => 10,
            'is_active' => true,
            'expires_at' => now()->subDay(),
        ]);

        $this->assertFalse($this->validateCoupon->execute($inactiveCoupon));
        $this->assertFalse($this->validateCoupon->execute($expiredCoupon));
    }

    public function test_percent_discount_is_calculated_from_subtotal(): void
    {
        $coupon = new Coupon([
            'type' => CouponType::Percent->value,
            'value' => 15,
        ]);

        $this->assertEquals(30.0, $this->calculateCouponDiscount->execute($coupon, 200));
    }

    public function test_fixed_discount_never_exceeds_subtotal(): void
    {
        $coupon = new Coupon([
            'type' => CouponType::Fixed->value,
            'value' => 50,
        ]);

        $this->assertEquals(30, $this->calculateCouponDiscount->execute($coupon, 30));
        $this->assertEquals(50, $this->calculateCouponDiscount->execute($coupon, 80));
    }
}
