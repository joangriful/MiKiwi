<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * ProductSeeder - Crea productos realistas del catálogo MiKiwi
 *
 * Mix de productos: 70% reales del negocio MiKiwi, 30% generados con Faker
 * Incluye relaciones de accesorios para productos configurables.
 */
class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ========================================
        // 1. OBTENER CATEGORÍAS
        // ========================================

        $catMunecasPremium = Category::where('slug', 'munecas-premium')->first();

        if (! $catMunecasPremium) {
            $this->command->error('❌ No se encontraron las categorías. Ejecuta CategorySeeder primero.');

            return;
        }

        $catMunecasBasicas = Category::where('slug', 'munecas-basicas')->first();
        $catVibradores = Category::where('slug', 'vibradores')->first();
        $catLubricantesAgua = Category::where('slug', 'base-agua')->first();
        $catLubricantesSilicona = Category::where('slug', 'base-silicona')->first();
        $catComponentes = Category::where('slug', 'componentes')->first();

        // ========================================
        // 2. PRODUCTOS REALISTAS DE MIKIWI
        // ========================================

        // Muñeca Premium Configurable
        $elsa = Product::firstOrCreate(
            ['sku' => 'DOLL-ELSA-001'],
            [
                'category_id' => $catMunecasPremium->id,
                'name' => 'Muñeca Elsa Premium',
                'slug' => 'muneca-elsa-premium',
                'description' => 'Muñeca realista de silicona médica con esqueleto articulado. Altura 165cm, peso 30kg. Personalizable en ojos, cabello y acabados. Incluye sistema de calentamiento interno y articulaciones de última generación.',
                'base_price' => 1899.00,
                'stock_quantity' => 5,
                'product_type' => 'configurable',
                'is_active' => true,
                'is_adult_only' => true,
                'images' => [
                    'https://placehold.co/800x800/EEE/333?text=Muñeca+Elsa+1',
                    'https://placehold.co/800x800/EEE/333?text=Muñeca+Elsa+2',
                    'https://placehold.co/800x800/EEE/333?text=Muñeca+Elsa+3',
                ],
            ]
        );

        // Muñeca Básica
        Product::firstOrCreate(
            ['sku' => 'DOLL-ANNA-001'],
            [
                'category_id' => $catMunecasBasicas->id,
                'name' => 'Muñeca Anna Básica',
                'slug' => 'muneca-anna-basica',
                'description' => 'Muñeca de TPE de alta calidad. Altura 158cm. Opción económica con excelente realismo. Ideal para iniciarse en este tipo de productos.',
                'base_price' => 899.00,
                'stock_quantity' => 12,
                'product_type' => 'simple',
                'is_active' => true,
                'is_adult_only' => true,
                'images' => [
                    'https://placehold.co/800x800/EEE/333?text=Muñeca+Anna',
                ],
            ]
        );

        // Lubricantes
        Product::firstOrCreate(
            ['sku' => 'LUBE-WAT-100'],
            [
                'category_id' => $catLubricantesAgua->id,
                'name' => 'Lubricante Base Agua Premium 100ml',
                'slug' => 'lubricante-agua-100ml',
                'description' => 'Lubricante premium a base de agua. Compatible con preservativos y juguetes. pH balanceado, hipoalergénico. Textura sedosa y larga duración.',
                'base_price' => 12.90,
                'stock_quantity' => 150,
                'product_type' => 'simple',
                'is_active' => true,
                'is_adult_only' => true,
                'images' => [
                    'https://placehold.co/800x800/EEE/333?text=Lubricante+Agua',
                ],
            ]
        );

        Product::firstOrCreate(
            ['sku' => 'LUBE-SIL-050'],
            [
                'category_id' => $catLubricantesSilicona->id,
                'name' => 'Lubricante Silicona Premium 50ml',
                'slug' => 'lubricante-silicona-50ml',
                'description' => 'Lubricante de larga duración a base de silicona. Resistente al agua. Ideal para uso en ducha o bañera. Ultra concentrado.',
                'base_price' => 19.90,
                'stock_quantity' => 80,
                'product_type' => 'simple',
                'is_active' => true,
                'is_adult_only' => true,
                'images' => [
                    'https://placehold.co/800x800/EEE/333?text=Lubricante+Silicona',
                ],
            ]
        );

        // Vibrador popular
        Product::firstOrCreate(
            ['sku' => 'VIB-SAT-P2'],
            [
                'category_id' => $catVibradores->id,
                'name' => 'Satisfyer Pro 2 Generation',
                'slug' => 'satisfyer-pro-2',
                'description' => 'Estimulador de clítoris por ondas de presión sin contacto. 11 intensidades. Resistente al agua. Recargable USB. Silicona médica.',
                'base_price' => 49.90,
                'stock_quantity' => 45,
                'product_type' => 'simple',
                'is_active' => true,
                'is_adult_only' => true,
                'images' => [
                    'https://placehold.co/800x800/EEE/333?text=Satisfyer+Pro+2',
                ],
            ]
        );

        // Componentes para muñecas configurables
        $ojosAzules = Product::firstOrCreate(
            ['sku' => 'COMP-EYE-BLU'],
            [
                'category_id' => $catComponentes->id,
                'name' => 'Ojos Azules Cristal Premium',
                'slug' => 'ojos-azules-cristal',
                'description' => 'Ojos de cristal azul intenso con acabado realista. Compatible con muñecas premium. Instalación incluida.',
                'base_price' => 50.00,
                'stock_quantity' => 100,
                'product_type' => 'component',
                'is_active' => true,
                'is_adult_only' => true,
                'images' => [
                    'https://placehold.co/800x800/EEE/333?text=Ojos+Azules',
                ],
            ]
        );

        $ojosMarrones = Product::firstOrCreate(
            ['sku' => 'COMP-EYE-BRW'],
            [
                'category_id' => $catComponentes->id,
                'name' => 'Ojos Marrones Avellana',
                'slug' => 'ojos-marrones-avellana',
                'description' => 'Ojos marrones cálidos con tonos avellana. Acabado ultra realista.',
                'base_price' => 50.00,
                'stock_quantity' => 100,
                'product_type' => 'component',
                'is_active' => true,
                'is_adult_only' => true,
                'images' => [
                    'https://placehold.co/800x800/EEE/333?text=Ojos+Marrones',
                ],
            ]
        );

        $pelucaRubia = Product::firstOrCreate(
            ['sku' => 'COMP-HAIR-BLND'],
            [
                'category_id' => $catComponentes->id,
                'name' => 'Peluca Rubia Larga Premium',
                'slug' => 'peluca-rubia-larga',
                'description' => 'Peluca de cabello sintético premium rubio largo. Tacto sedoso, resistente al calor. Peinado personalizable.',
                'base_price' => 80.00,
                'stock_quantity' => 100,
                'product_type' => 'component',
                'is_active' => true,
                'is_adult_only' => true,
                'images' => [
                    'https://placehold.co/800x800/EEE/333?text=Peluca+Rubia',
                ],
            ]
        );

        $pelucaNegra = Product::firstOrCreate(
            ['sku' => 'COMP-HAIR-BLK'],
            [
                'category_id' => $catComponentes->id,
                'name' => 'Peluca Negra Lisa',
                'slug' => 'peluca-negra-lisa',
                'description' => 'Peluca de cabello sintético negro azabache, estilo liso. Brillo natural.',
                'base_price' => 80.00,
                'stock_quantity' => 100,
                'product_type' => 'component',
                'is_active' => true,
                'is_adult_only' => true,
                'images' => [
                    'https://placehold.co/800x800/EEE/333?text=Peluca+Negra',
                ],
            ]
        );

        // Más productos realistas
        Product::firstOrCreate(
            ['sku' => 'VIB-WOM-CL'],
            [
                'category_id' => $catVibradores->id,
                'name' => 'Womanizer Classic',
                'slug' => 'womanizer-classic',
                'description' => 'Estimulador premium con tecnología Pleasure Air. 6 intensidades. Totalmente sumergible.',
                'base_price' => 79.90,
                'stock_quantity' => 30,
                'product_type' => 'simple',
                'is_active' => true,
                'is_adult_only' => true,
                'images' => [
                    'https://placehold.co/800x800/EEE/333?text=Womanizer',
                ],
            ]
        );

        Product::firstOrCreate(
            ['sku' => 'LUBE-WAT-250'],
            [
                'category_id' => $catLubricantesAgua->id,
                'name' => 'Lubricante Base Agua Neutro 250ml',
                'slug' => 'lubricante-agua-250ml',
                'description' => 'Formato económico 250ml. Sin sabor, sin olor. Dermatológicamente testado.',
                'base_price' => 24.90,
                'stock_quantity' => 200,
                'product_type' => 'simple',
                'is_active' => true,
                'is_adult_only' => true,
                'images' => [
                    'https://placehold.co/800x800/EEE/333?text=Lubricante+250ml',
                ],
            ]
        );

        // ========================================
        // 3. RELACIONES DE ACCESORIOS
        // ========================================

        // Asociar accesorios a Muñeca Elsa (configurable)
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
                'accessory_product_id' => $ojosMarrones->id,
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
            [
                'parent_product_id' => $elsa->id,
                'accessory_product_id' => $pelucaNegra->id,
                'is_mandatory' => false,
                'group_name' => 'Cabello',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // ========================================
        // 4. PRODUCTOS GENERADOS CON FAKER
        // ========================================

        // 30% productos generados (7 productos adicionales aprox)
        $allCategories = Category::whereNotNull('parent_id')->get(); // Solo subcategorías

        $this->command->info('Categorías encontradas: '.$allCategories->count());

        if ($allCategories->isNotEmpty()) {
            $this->command->info('Creando 7 productos adicionales...');
            Product::factory()->count(7)->make()->each(function ($product) use ($allCategories) {
                $product->category_id = $allCategories->random()->id;
                $product->is_adult_only = true;
                $product->save();
            });
        } else {
            $this->command->warn('No hay subcategorías para crear productos aleatorios.');
        }

        $this->command->info('✅ Productos creados: 11 productos realistas + 7 generados = 18 productos totales');
        $this->command->info('✅ Accesorios configurados: 4 opciones para Muñeca Elsa');
    }
}
