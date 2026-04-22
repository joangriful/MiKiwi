<?php

namespace Tests\Feature\Database;

use App\Enums\CouponType;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\ProductType;
use App\Enums\UserRole;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class StringEnumCompatibilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_database_enum_fields_are_persisted_as_php_validated_strings(): void
    {
        $support = User::factory()->create([
            'role' => UserRole::Support->value,
        ]);

        $product = Product::factory()->create([
            'product_type' => ProductType::Component->value,
        ]);

        $order = Order::factory()->for($support)->create([
            'status' => OrderStatus::Cancelled->value,
            'payment_status' => PaymentStatus::Refunded->value,
        ]);

        $coupon = Coupon::create([
            'code' => 'FIXED10',
            'type' => CouponType::Fixed->value,
            'value' => 10,
            'is_active' => true,
        ]);

        $this->assertSame(UserRole::Support->value, $support->fresh()->role);
        $this->assertSame(ProductType::Component->value, $product->fresh()->product_type);
        $this->assertSame(OrderStatus::Cancelled->value, $order->fresh()->status);
        $this->assertSame(PaymentStatus::Refunded->value, $order->fresh()->payment_status);
        $this->assertSame(CouponType::Fixed->value, $coupon->fresh()->type);
    }

    public function test_database_enum_fields_are_backed_by_string_columns(): void
    {
        foreach ($this->stringEnumColumns() as [$table, $column]) {
            $metadata = collect(Schema::getColumns($table))->firstWhere('name', $column);
            $typeName = strtolower((string) ($metadata['type_name'] ?? $metadata['type'] ?? ''));

            $this->assertNotSame('enum', $typeName, "{$table}.{$column} should not be a SQL enum.");
            $this->assertStringContainsString('char', $typeName, "{$table}.{$column} should be a string column.");
        }
    }

    private function stringEnumColumns(): array
    {
        return [
            ['users', 'role'],
            ['products', 'product_type'],
            ['orders', 'status'],
            ['orders', 'payment_status'],
            ['coupons', 'type'],
        ];
    }
}
