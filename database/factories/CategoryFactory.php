<?php

declare(strict_types=1);

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        $name = $this->faker->unique()->word; // Ej: "Vibradores"

        return [
            'name' => ucfirst($name),
            'slug' => Str::slug($name),
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the category is a root category.
     * Categories are flat in the current schema, so this is a no-op alias.
     */
    public function root(): static
    {
        return $this->state(fn (array $attributes) => []);
    }

    /**
     * Indicate that the category is a child category.
     * Categories are flat in the current schema, so this is a no-op alias.
     */
    public function child(): static
    {
        return $this->state(fn (array $attributes) => []);
    }

    /**
     * Indicate that the category is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
