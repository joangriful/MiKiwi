<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory for creating OrderItem test instances.
 *
 * This factory uses lazy loading for products to avoid premature database creation.
 * Product data is synchronized to snapshots via the afterMaking callback.
 *
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * Uses lazy loading (Product::factory() without ->create()) to avoid
     * creating products in the database prematurely. The configure() method
     * synchronizes product data to snapshots when the model is made.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'product_id' => Product::factory(), // Lazy loading - no ->create()
            'product_name_snapshot' => $this->faker->words(3, true),
            'sku_snapshot' => strtoupper($this->faker->bothify('MIKI-####-???')),
            'quantity' => $this->faker->numberBetween(1, 5),
            'unit_price' => $this->faker->randomFloat(2, 10.00, 1000.00),
        ];
    }

    /**
     * Configure the factory to sync product data to snapshots.
     *
     * This callback runs after making (but before creating) the model,
     * ensuring that snapshot fields reflect the actual product data.
     * This preserves historical accuracy in order items.
     */
    public function configure(): static
    {
        return $this->afterMaking(function (OrderItem $item) {
            if ($item->product) {
                $item->product_name_snapshot = $item->product->name;
                $item->sku_snapshot = $item->product->sku;
                $item->unit_price = $item->product->base_price;
            }
        });
    }

    /**
     * Create an order item for a specific product.
     *
     * Snapshots are automatically populated from the product.
     */
    public function forProduct(Product $product): static
    {
        return $this->state(fn (array $attributes) => [
            'product_id' => $product->id,
            'product_name_snapshot' => $product->name,
            'sku_snapshot' => $product->sku,
            'unit_price' => $product->base_price,
        ]);
    }

    /**
     * Create an order item for a specific order.
     */
    public function forOrder(Order $order): static
    {
        return $this->state(fn (array $attributes) => [
            'order_id' => $order->id,
        ]);
    }

    /**
     * Create an order item with a specific quantity.
     */
    public function withQuantity(int $quantity): static
    {
        return $this->state(fn (array $attributes) => [
            'quantity' => $quantity,
        ]);
    }

    /**
     * Create an order item for a deleted product.
     *
     * Simulates historical orders where the product no longer exists.
     * The snapshots preserve the product information.
     */
    public function deletedProduct(): static
    {
        return $this->state(fn (array $attributes) => [
            'product_id' => null,
            'product_name_snapshot' => 'Producto eliminado - '.$this->faker->words(3, true),
            'sku_snapshot' => strtoupper($this->faker->bothify('DEL-####-???')),
        ]);
    }
}
