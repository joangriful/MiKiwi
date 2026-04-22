<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory for creating Order test instances.
 *
 * This factory generates realistic order data with Spanish address snapshots,
 * unique order numbers, and various order states for comprehensive testing.
 *
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * Generates a pending order with Spanish billing and shipping addresses,
     * a unique order number, and realistic monetary values.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'order_number' => $this->generateOrderNumber(),
            'status' => OrderStatus::Pending->value,
            'payment_status' => PaymentStatus::Pending->value,
            'total_amount' => $this->faker->randomFloat(2, 20.00, 500.00),
            'shipping_address_snapshot' => $this->generateAddressSnapshot(),
            'billing_address_snapshot' => $this->generateAddressSnapshot(),
        ];
    }

    /**
     * Generate a unique order number with format: ORD-YYYYMMDD-XXXXX
     */
    private function generateOrderNumber(): string
    {
        $date = now()->format('Ymd');
        $random = strtoupper($this->faker->bothify('?????'));

        return "ORD-{$date}-{$random}";
    }

    /**
     * Generate a realistic Spanish address snapshot.
     *
     * Creates immutable address data for historical order records.
     * All data uses Spanish formatting conventions.
     *
     * @return array<string, string>
     */
    private function generateAddressSnapshot(): array
    {
        return [
            'full_name' => $this->faker->name(),
            'phone' => $this->faker->regexify('(\+34\s)?[6-9]\d{2}\s?\d{3}\s?\d{3}'),
            'street_address' => $this->faker->streetAddress(),
            'city' => $this->faker->city(),
            'postal_code' => $this->faker->regexify('[0-5]\d{4}'),
            'country' => 'España',
        ];
    }

    /**
     * Indicate that the order is being processed.
     */
    public function processing(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => OrderStatus::Processing->value,
        ]);
    }

    /**
     * Indicate that the order has been shipped.
     */
    public function shipped(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => OrderStatus::Shipped->value,
        ]);
    }

    /**
     * Indicate that the order has been delivered.
     */
    public function delivered(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => OrderStatus::Delivered->value,
        ]);
    }

    /**
     * Indicate that the order has been cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => OrderStatus::Cancelled->value,
        ]);
    }

    /**
     * Indicate that the order payment has been completed.
     */
    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_status' => PaymentStatus::Paid->value,
        ]);
    }

    /**
     * Indicate that the order payment has failed.
     */
    public function paymentFailed(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_status' => PaymentStatus::Failed->value,
        ]);
    }

    /**
     * Indicate that the order is complete (delivered and paid).
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => OrderStatus::Delivered->value,
            'payment_status' => PaymentStatus::Paid->value,
        ]);
    }
}
