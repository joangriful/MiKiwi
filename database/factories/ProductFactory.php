<?php

namespace Database\Factories;

use App\Models\Category;
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
            'image_url' => 'https://placehold.co/600x600/png?text=' . urlencode($name), // Placeholder dinámico
            
            // Relacionamos con una categoría existente o creamos una nueva si hace falta
            'category_id' => Category::factory(),
        ];
    }
}