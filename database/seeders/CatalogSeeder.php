<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        // 1. TUS CATEGORÍAS (Mantenemos las tuyas y agregamos 'Componentes')
        $catDolls = Category::create(['name' => 'Muñecas', 'slug' => 'dolls']);
        $catToys = Category::create(['name' => 'Accesorios', 'slug' => 'toys']);
        $catComponents = Category::create(['name' => 'Componentes', 'slug' => 'components']); // Nueva para piezas

        // 2. TU PRODUCTO SIMPLE (Lubricante)
        Product::create([
            'category_id' => $catToys->id,
            'name' => 'Lubricante 100ml',
            'slug' => 'lube-100',
            'sku' => 'LUBE-001',
            'base_price' => 15.00,
            'stock_quantity' => 50,
            'product_type' => 'simple',
            'is_active' => true, // Aseguramos que esté activo
            'images' => json_encode(['https://placehold.co/400?text=Lube']),
        ]);

        // 3. TU MUÑECA CONFIGURABLE (Elsa)
        $elsa = Product::create([
            'category_id' => $catDolls->id,
            'name' => 'Muñeca Elsa',
            'slug' => 'elsa-doll',
            'sku' => 'DOLL-001',
            'base_price' => 1200.00,
            'stock_quantity' => 10, // Le ponemos stock para que el OrderController no falle
            'product_type' => 'configurable',
            'is_active' => true,
            'images' => json_encode(['https://placehold.co/400?text=Elsa']),
        ]);

        // 4. NUEVO: CREAR COMPONENTES (Para probar el configurador)
        $ojosAzules = Product::create([
            'category_id' => $catComponents->id,
            'name' => 'Ojos Azules Cristal',
            'slug' => 'ojos-azules',
            'sku' => 'COMP-EYE-BLU',
            'base_price' => 50.00,
            'stock_quantity' => 100,
            'product_type' => 'component', // O simple, según tu lógica
            'is_active' => true,
        ]);

        $pelucaRubia = Product::create([
            'category_id' => $catComponents->id,
            'name' => 'Peluca Rubia Larga',
            'slug' => 'peluca-rubia',
            'sku' => 'COMP-HAIR-BLND',
            'base_price' => 80.00,
            'stock_quantity' => 100,
            'product_type' => 'component',
            'is_active' => true,
        ]);

        // 5. NUEVO: LA RELACIÓN PIVOTE (La magia del configurador)
        // Esto permite que cuando llames al Repo, 'Elsa' traiga sus opciones.

        // Opción A: Si tienes la relación 'accessories' en el Modelo Product
        if (method_exists($elsa, 'accessories')) {
            $elsa->accessories()->attach([$ojosAzules->id, $pelucaRubia->id]);
        }
        // Opción B: Inserción manual en la tabla pivote (si no has definido la relación aún)
        else {
            // Asegúrate que la tabla se llame 'product_accessories' o la que hayas definido
            DB::table('product_accessories')->insert([
                [
                    'parent_product_id' => $elsa->id,
                    'accessory_product_id' => $ojosAzules->id,
                    'is_mandatory' => false,
                    'group_name' => 'Ojos',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'parent_product_id' => $elsa->id,
                    'accessory_product_id' => $pelucaRubia->id,
                    'is_mandatory' => false,
                    'group_name' => 'Cabello',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }

        // 6. RELLENO MASIVO (Para probar paginación y "Productos Relacionados")
        // Creamos 15 muñecas extra usando el Factory
        if (class_exists(\Database\Factories\ProductFactory::class)) {
            Product::factory()->count(15)->create([
                'category_id' => $catDolls->id,
                'product_type' => 'configurable',
            ]);
        }
    }
}
