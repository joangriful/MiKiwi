<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        $name = $this->faker->unique()->word; // Ej: "Vibradores"

        return [
            'parent_id' => null,
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
        return $this->state(fn (array $attributes) => [
            'parent_id' => null,
        ]);
    }

    /**
     * Indicate that the category is a child category.
     */
    public function child(?Category $parent = null): static
    {
        return $this->state(fn (array $attributes) => [
            'parent_id' => ($parent ?? Category::factory()->root()->create())->getKey(),
        ]);
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
