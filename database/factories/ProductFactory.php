<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\ProductType;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name = $this->faker->unique()->words(3, true); // Ej: "Satisfyer Pro 2"

        return [
            'name' => ucfirst($name),
            'slug' => Str::slug($name),
            'sku' => strtoupper($this->faker->bothify('MIKI-####-???')),
            'description' => $this->faker->paragraph(3),
            'base_price' => $this->faker->randomFloat(2, 15, 150), // Entre 15€ y 150€
            'stock_quantity' => $this->faker->numberBetween(0, 50),
            'is_active' => true,
            'product_type' => ProductType::Simple->value,
            'is_adult_only' => true,
            'is_promoted' => false,

            // Relacionamos con una categoría existente o creamos una nueva si hace falta
            'category_id' => Category::factory(),
        ];
    }

    private function generateProductImages(string $name, int $count = 3): array
    {
        return array_map(
            fn ($i) => 'https://placehold.co/800x800/png?text='.urlencode($name)."+$i",
            range(1, $count)
        );
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Product $product): void {
            if ($product->images()->exists()) {
                return;
            }

            foreach ($this->generateProductImages($product->name, random_int(1, 3)) as $index => $imageUrl) {
                ProductImage::query()->create([
                    'product_id' => $product->getKey(),
                    'public_id' => (string) Str::uuid(),
                    'image_url' => $imageUrl,
                    'alt_text' => $product->name,
                    'sort_order' => $index,
                ]);
            }
        });
    }

    /**
     * Indicate that the product is a simple product.
     */
    public function simple(): static
    {
        return $this->state(fn (array $attributes) => [
            'product_type' => ProductType::Simple->value,
        ]);
    }

    /**
     * Indicate that the product is configurable (e.g., customizable dolls).
     */
    public function configurable(): static
    {
        return $this->state(fn (array $attributes) => [
            'product_type' => ProductType::Configurable->value,
            'base_price' => $this->faker->randomFloat(2, 500, 3000),
        ]);
    }

    /**
     * Indicate that the product is a ready-made doll.
     */
    public function doll(): static
    {
        return $this->state(fn (array $attributes) => [
            'product_type' => ProductType::Doll->value,
            'base_price' => $this->faker->randomFloat(2, 500, 3000),
        ]);
    }

    /**
     * Indicate that the product is a component (e.g., eyes, wigs).
     */
    public function component(): static
    {
        return $this->state(fn (array $attributes) => [
            'product_type' => ProductType::Component->value,
            'base_price' => $this->faker->randomFloat(2, 20, 200),
        ]);
    }

    /**
     * Indicate that the product is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => 0,
        ]);
    }

    /**
     * Indicate that the product is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the product is on sale with reduced price.
     */
    public function onSale(): static
    {
        return $this->state(function (array $attributes) {
            $originalPrice = $attributes['base_price'] ?? 100;
            $discountPercentage = $this->faker->numberBetween(10, 50);
            $salePrice = $originalPrice * (1 - $discountPercentage / 100);

            return [
                'base_price' => round($salePrice, 2),
            ];
        });
    }

    /**
     * Indicate that the product is for adults only.
     */
    public function adultOnly(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_adult_only' => true,
        ]);
    }

    /**
     * Indicate that the product has high stock.
     */
    public function inStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => $this->faker->numberBetween(50, 200),
        ]);
    }
}
