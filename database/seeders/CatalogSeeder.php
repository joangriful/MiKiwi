<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;


class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        // Categorías
        $catDolls = Category::create(['name' => 'Muñecas', 'slug' => 'dolls']);
        $catToys  = Category::create(['name' => 'Accesorios', 'slug' => 'toys']);

        // Producto Simple
        Product::create([
            'category_id' => $catToys->id,
            'name' => 'Lubricante 100ml',
            'slug' => 'lube-100',
            'sku' => 'LUBE-001',
            'base_price' => 15.00,
            'stock_quantity' => 50,
            'product_type' => 'simple',
            'is_adult_only' => false
        ]);

        // Muñeca Configurable
        Product::create([
            'category_id' => $catDolls->id,
            'name' => 'Muñeca Elsa',
            'slug' => 'elsa-doll',
            'sku' => 'DOLL-001',
            'base_price' => 1200.00,
            'stock_quantity' => null,
            'product_type' => 'configurable',
            'images' => json_encode(['https://via.placeholder.com/150'])
        ]);
    }
}
