<?php

namespace Database\Seeders;

use App\Enums\ProductType;
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
                            ?? Category::first();

        if (! $catMunecasPremium) {
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
        $elsa = Product::updateOrCreate(
            ['sku' => 'DOLL-ELSA-001'],
            [
                'category_id' => $catMunecasPremium->getKey(),
                'name' => 'Muñeca Elsa Premium',
                'slug' => 'muneca-elsa-premium',
                'description' => 'Muñeca realista de silicona médica con esqueleto articulado. Altura 165cm, peso 30kg. Personalizable.',
                'base_price' => 1899.00,
                'stock_quantity' => 5,
                'product_type' => ProductType::Configurable->value,
                'is_active' => true,
                'is_adult_only' => true,
                'images' => ['https://placehold.co/800x800/EEE/333?text=Muñeca+Elsa+1'],
            ]
        );

        // Muñeca Anna
        Product::updateOrCreate(
            ['sku' => 'DOLL-ANNA-001'],
            [
                'category_id' => $catMunecasBasicas->getKey(),
                'name' => 'Muñeca Anna Básica',
                'slug' => 'muneca-anna-basica',
                'description' => 'Muñeca de TPE de alta calidad. Opción económica con excelente realismo.',
                'base_price' => 899.00,
                'stock_quantity' => 12,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
                'is_adult_only' => true,
                'images' => ['https://placehold.co/800x800/EEE/333?text=Muñeca+Anna'],
            ]
        );

        // Lubricante Agua
        Product::updateOrCreate(
            ['sku' => 'LUBE-WAT-100'],
            [
                'category_id' => $catLubricantesAgua->getKey(),
                'name' => 'Lubricante Base Agua Premium 100ml',
                'slug' => 'lubricante-agua-100ml',
                'description' => 'Lubricante premium a base de agua. pH balanceado.',
                'base_price' => 12.90,
                'stock_quantity' => 150,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
                'is_adult_only' => true,
                'images' => ['https://placehold.co/800x800/EEE/333?text=Lubricante+Agua'],
            ]
        );

        // Componentes (Ojos y Pelucas)
        $ojosAzules = Product::updateOrCreate(
            ['sku' => 'COMP-EYE-BLU'],
            [
                'category_id' => $catComponentes->getKey(),
                'name' => 'Ojos Azules Cristal Premium',
                'slug' => 'ojos-azules-cristal',
                'description' => 'Ojos de cristal azul intenso con acabado realista.',
                'base_price' => 50.00,
                'stock_quantity' => 100,
                'product_type' => ProductType::Component->value,
                'is_active' => true,
                'is_adult_only' => true,
                'images' => ['https://placehold.co/800x800/EEE/333?text=Ojos+Azules'],
            ]
        );

        $ojosMarrones = Product::updateOrCreate(
            ['sku' => 'COMP-EYE-BRW'],
            [
                'category_id' => $catComponentes->getKey(),
                'name' => 'Ojos Marrones Avellana',
                'slug' => 'ojos-marrones-avellana',
                'description' => 'Ojos marrones cálidos. Acabado ultra realista.',
                'base_price' => 50.00,
                'stock_quantity' => 100,
                'product_type' => ProductType::Component->value,
                'is_active' => true,
                'is_adult_only' => true,
                'images' => ['https://placehold.co/800x800/EEE/333?text=Ojos+Marrones'],
            ]
        );

        $pelucaRubia = Product::updateOrCreate(
            ['sku' => 'COMP-HAIR-BLND'],
            [
                'category_id' => $catComponentes->getKey(),
                'name' => 'Peluca Rubia Larga Premium',
                'slug' => 'peluca-rubia-larga',
                'description' => 'Cabello sintético premium resistente al calor.',
                'base_price' => 80.00,
                'stock_quantity' => 100,
                'product_type' => ProductType::Component->value,
                'is_active' => true,
                'is_adult_only' => true,
                'images' => ['https://placehold.co/800x800/EEE/333?text=Peluca+Rubia'],
            ]
        );

        $pelucaNegra = Product::updateOrCreate(
            ['sku' => 'COMP-HAIR-BLK'],
            [
                'category_id' => $catComponentes->getKey(),
                'name' => 'Peluca Negra Lisa',
                'slug' => 'peluca-negra-lisa',
                'description' => 'Peluca de cabello sintético negro azabache.',
                'base_price' => 80.00,
                'stock_quantity' => 100,
                'product_type' => ProductType::Component->value,
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
            ['parent_product_id' => $elsa->getKey(), 'accessory_product_id' => $ojosAzules->getKey(), 'is_mandatory' => false, 'group_name' => 'Ojos', 'created_at' => now(), 'updated_at' => now()],
            ['parent_product_id' => $elsa->getKey(), 'accessory_product_id' => $ojosMarrones->getKey(), 'is_mandatory' => false, 'group_name' => 'Ojos', 'created_at' => now(), 'updated_at' => now()],
            ['parent_product_id' => $elsa->getKey(), 'accessory_product_id' => $pelucaRubia->getKey(), 'is_mandatory' => false, 'group_name' => 'Cabello', 'created_at' => now(), 'updated_at' => now()],
            ['parent_product_id' => $elsa->getKey(), 'accessory_product_id' => $pelucaNegra->getKey(), 'is_mandatory' => false, 'group_name' => 'Cabello', 'created_at' => now(), 'updated_at' => now()],
        ], ['parent_product_id', 'accessory_product_id'], ['group_name', 'updated_at']);

        // ========================================
        // 4. PRODUCTOS GENERADOS CON FAKER
        // ========================================

        $allCategories = Category::all();

        if ($allCategories->isNotEmpty()) {
            $this->command->info('Verificando productos adicionales de demo...');
            $categories = $allCategories->values();

            foreach (range(1, 7) as $index) {
                $category = $categories->get(($index - 1) % $categories->count());

                Product::updateOrCreate(
                    ['sku' => sprintf('DEMO-PROD-%03d', $index)],
                    [
                        'category_id' => $category->getKey(),
                        'name' => sprintf('Producto Demo %02d', $index),
                        'slug' => sprintf('producto-demo-%02d', $index),
                        'description' => sprintf('Producto de demostración %02d para catálogo.', $index),
                        'base_price' => 25 + ($index * 5),
                        'stock_quantity' => 20,
                        'product_type' => ProductType::Simple->value,
                        'is_active' => true,
                        'is_adult_only' => true,
                        'images' => [sprintf('https://placehold.co/800x800/EEE/333?text=Demo+%02d', $index)],
                    ]
                );
            }
        }

        $this->command->info('✅ ProductSeeder completado con éxito.');
    }
}
