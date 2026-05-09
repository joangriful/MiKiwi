<?php

namespace Database\Seeders;

use App\Enums\CouponType;
use App\Enums\ProductType;
use App\Models\Coupon;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->coupons() as $coupon) {
            Coupon::query()->updateOrCreate(
                ['code' => $coupon['code']],
                $coupon
            );
        }
    }

    /**
     * @return array<int, array{
     *     code: string,
     *     type: string,
     *     value: float,
     *     minimum_amount: float|null,
     *     first_order_only: bool,
     *     required_product_type: string|null,
     *     is_active: bool,
     *     expires_at: null
     * }>
     */
    private function coupons(): array
    {
        return [
            [
                'code' => 'BIENVENIDA10',
                'type' => CouponType::Percent->value,
                'value' => 10.00,
                'minimum_amount' => 30.00,
                'first_order_only' => true,
                'required_product_type' => null,
                'is_active' => true,
                'expires_at' => null,
            ],
            [
                'code' => 'KIWI15',
                'type' => CouponType::Percent->value,
                'value' => 15.00,
                'minimum_amount' => 75.00,
                'first_order_only' => false,
                'required_product_type' => null,
                'is_active' => true,
                'expires_at' => null,
            ],
            [
                'code' => 'DOLL20',
                'type' => CouponType::Percent->value,
                'value' => 20.00,
                'minimum_amount' => 3200.00,
                'first_order_only' => false,
                'required_product_type' => ProductType::Doll->value,
                'is_active' => true,
                'expires_at' => null,
            ],
            [
                'code' => 'VIP25',
                'type' => CouponType::Percent->value,
                'value' => 25.00,
                'minimum_amount' => 100.00,
                'first_order_only' => false,
                'required_product_type' => null,
                'is_active' => true,
                'expires_at' => null,
            ],
        ];
    }
}
