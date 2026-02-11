<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * ProductSeeder - Crea productos realistas del catálogo MiKiwi
 */
class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ========================================
        // 1. OBTENER CATEGORÍAS (CON FALLBACK)
        // ========================================

        // Buscamos la categoría principal. Si no existe el slug, tomamos la primera de la tabla.
        $catMunecasPremium = Category::where('slug', 'munecas-premium')->first() 
                            ?? Category::where('name', 'LIKE', '%Premium%')->first()
                            ?? Category::first();

        if (!$catMunecasPremium) {
            $this->command->error('❌ ERROR CRÍTICO: No hay categorías en la base de datos. Abortando.');
            return;
        }

        // Para las demás, si no existen, usamos la Premium para que el código no dé error de "null"
        $catMunecasBasicas = Category::where('slug', 'munecas-basicas')->first() ?? $catMunecasPremium;
        $catVibradores = Category::where('slug', 'vibradores')->first() ?? $catMunecasPremium;
        $catLubricantesAgua = Category::where('slug', 'base-agua')->first() ?? $catMunecasPremium;
        $catLubricantesSilicona = Category::where('slug', 'base-silicona')->first() ?? $catMunecasPremium;
        $catComponentes = Category::where('slug', 'componentes')->first() ?? $catMunecasPremium;

        $this->command->info('✅ Categorías vinculadas correctamente.');

        // ========================================
        // 2. PRODUCTOS REALISTAS DE MIKIWI
        // ========================================

        // Muñeca Elsa
        $elsa = Product::firstOrCreate(
            ['sku' => 'DOLL-ELSA-001'],
            [
                'category_id' => $catMunecasPremium->id,
                'name' => 'Muñeca Elsa Premium',
                'slug' => 'muneca-elsa-premium',
                'description' => 'Muñeca realista de silicona médica con esqueleto articulado. Altura 165cm, peso 30kg. Personalizable.',
                'base_price' => 1899.00,
                'stock_quantity' => 5,
                'product_type' => 'configurable',
                'is_active' => true,
                'is_adult_only' => true,
                'images' => ['https://placehold.co/800x800/EEE/333?text=Muñeca+Elsa+1'],
            ]
        );

        // Muñeca Anna
        Product::firstOrCreate(
            ['sku' => 'DOLL-ANNA-001'],
            [
                'category_id' => $catMunecasBasicas->id,
                'name' => 'Muñeca Anna Básica',
                'slug' => 'muneca-anna-basica',
                'description' => 'Muñeca de TPE de alta calidad. Opción económica con excelente realismo.',
                'base_price' => 899.00,
                'stock_quantity' => 12,
                'product_type' => 'simple',
                'is_active' => true,
                'is_adult_only' => true,
                'images' => ['https://placehold.co/800x800/EEE/333?text=Muñeca+Anna'],
            ]
        );

        // Lubricante Agua
        Product::firstOrCreate(
            ['sku' => 'LUBE-WAT-100'],
            [
                'category_id' => $catLubricantesAgua->id,
                'name' => 'Lubricante Base Agua Premium 100ml',
                'slug' => 'lubricante-agua-100ml',
                'description' => 'Lubricante premium a base de agua. pH balanceado.',
                'base_price' => 12.90,
                'stock_quantity' => 150,
                'product_type' => 'simple',
                'is_active' => true,
                'is_adult_only' => true,
                'images' => ['https://placehold.co/800x800/EEE/333?text=Lubricante+Agua'],
            ]
        );

        // Componentes (Ojos y Pelucas)
        $ojosAzules = Product::firstOrCreate(
            ['sku' => 'COMP-EYE-BLU'],
            [
                'category_id' => $catComponentes->id,
                'name' => 'Ojos Azules Cristal Premium',
                'slug' => 'ojos-azules-cristal',
                'description' => 'Ojos de cristal azul intenso con acabado realista.',
                'base_price' => 50.00,
                'stock_quantity' => 100,
                'product_type' => 'component',
                'is_active' => true,
                'is_adult_only' => true,
                'images' => ['https://placehold.co/800x800/EEE/333?text=Ojos+Azules'],
            ]
        );

        $ojosMarrones = Product::firstOrCreate(
            ['sku' => 'COMP-EYE-BRW'],
            [
                'category_id' => $catComponentes->id,
                'name' => 'Ojos Marrones Avellana',
                'slug' => 'ojos-marrones-avellana',
                'description' => 'Ojos marrones cálidos. Acabado ultra realista.',
                'base_price' => 50.00,
                'stock_quantity' => 100,
                'product_type' => 'component',
                'is_active' => true,
                'is_adult_only' => true,
                'images' => ['https://placehold.co/800x800/EEE/333?text=Ojos+Marrones'],
            ]
        );

        $pelucaRubia = Product::firstOrCreate(
            ['sku' => 'COMP-HAIR-BLND'],
            [
                'category_id' => $catComponentes->id,
                'name' => 'Peluca Rubia Larga Premium',
                'slug' => 'peluca-rubia-larga',
                'description' => 'Cabello sintético premium resistente al calor.',
                'base_price' => 80.00,
                'stock_quantity' => 100,
                'product_type' => 'component',
                'is_active' => true,
                'is_adult_only' => true,
                'images' => ['https://placehold.co/800x800/EEE/333?text=Peluca+Rubia'],
            ]
        );

        $pelucaNegra = Product::firstOrCreate(
            ['sku' => 'COMP-HAIR-BLK'],
            [
                'category_id' => $catComponentes->id,
                'name' => 'Peluca Negra Lisa',
                'slug' => 'peluca-negra-lisa',
                'description' => 'Peluca de cabello sintético negro azabache.',
                'base_price' => 80.00,
                'stock_quantity' => 100,
                'product_type' => 'component',
                'is_active' => true,
                'is_adult_only' => true,
                'images' => ['https://placehold.co/800x800/EEE/333?text=Peluca+Negra'],
            ]
        );

        // ========================================
        // 3. RELACIONES DE ACCESORIOS
        // ========================================

        $this->command->info('📍 Configurando accesorios para productos...');

        DB::table('product_accessories')->upsert([
            ['parent_product_id' => $elsa->id, 'accessory_product_id' => $ojosAzules->id, 'is_mandatory' => false, 'group_name' => 'Ojos', 'created_at' => now(), 'updated_at' => now()],
            ['parent_product_id' => $elsa->id, 'accessory_product_id' => $ojosMarrones->id, 'is_mandatory' => false, 'group_name' => 'Ojos', 'created_at' => now(), 'updated_at' => now()],
            ['parent_product_id' => $elsa->id, 'accessory_product_id' => $pelucaRubia->id, 'is_mandatory' => false, 'group_name' => 'Cabello', 'created_at' => now(), 'updated_at' => now()],
            ['parent_product_id' => $elsa->id, 'accessory_product_id' => $pelucaNegra->id, 'is_mandatory' => false, 'group_name' => 'Cabello', 'created_at' => now(), 'updated_at' => now()],
        ], ['parent_product_id', 'accessory_product_id'], ['group_name', 'updated_at']);

        // ========================================
        // 4. PRODUCTOS GENERADOS CON FAKER
        // ========================================

        $allCategories = Category::all();

        if ($allCategories->isNotEmpty()) {
            $this->command->info('Creando productos adicionales con Faker...');
            foreach (range(1, 7) as $i) {
                Product::factory()->create([
                    'category_id' => $allCategories->random()->id,
                    'is_adult_only' => true,
                ]);
            }
        }

        $this->command->info('✅ ProductSeeder completado con éxito.');
    }
}