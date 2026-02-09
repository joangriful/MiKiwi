<?php

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
            'description' => $this->faker->sentence(),
            'is_active' => true,
            'parent_id' => null, // Por defecto raíz, lo cambiaremos en el Seeder
        ];
    }
}
