<?php

namespace Database\Seeders;

use App\Enums\ProductType;
use App\Models\Category;
use App\Models\Collection;
use App\Models\CollectionProduct;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

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
            ]
        );
        $this->syncProductImages($elsa, ['https://placehold.co/800x800/EEE/333?text=Muñeca+Elsa+1']);
        $this->syncProductCollections($elsa, ['para-ella']);

        // Muñeca Anna
        $anna = Product::updateOrCreate(
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
            ]
        );
        $this->syncProductImages($anna, ['https://placehold.co/800x800/EEE/333?text=Muñeca+Anna']);
        $this->syncProductCollections($anna, ['para-ella']);

        // Lubricante Agua
        $lube = Product::updateOrCreate(
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
            ]
        );
        $this->syncProductImages($lube, ['https://placehold.co/800x800/EEE/333?text=Lubricante+Agua']);
        $this->syncProductCollections($lube, ['parejas']);

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
            ]
        );
        $this->syncProductImages($ojosAzules, ['https://placehold.co/800x800/EEE/333?text=Ojos+Azules']);

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
            ]
        );
        $this->syncProductImages($ojosMarrones, ['https://placehold.co/800x800/EEE/333?text=Ojos+Marrones']);

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
            ]
        );
        $this->syncProductImages($pelucaRubia, ['https://placehold.co/800x800/EEE/333?text=Peluca+Rubia']);

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
            ]
        );
        $this->syncProductImages($pelucaNegra, ['https://placehold.co/800x800/EEE/333?text=Peluca+Negra']);

        // ========================================
        // 3. RELACIONES DE ACCESORIOS
        // ========================================

        $this->command->info('📍 Configurando accesorios para productos...');

        DB::table('doll_product_accessory')->upsert([
            ['id' => (string) Str::uuid(), 'doll_product_id' => $elsa->getKey(), 'accessory_product_id' => $ojosAzules->getKey(), 'is_mandatory' => false, 'group_name' => 'Ojos', 'created_at' => now(), 'updated_at' => now()],
            ['id' => (string) Str::uuid(), 'doll_product_id' => $elsa->getKey(), 'accessory_product_id' => $ojosMarrones->getKey(), 'is_mandatory' => false, 'group_name' => 'Ojos', 'created_at' => now(), 'updated_at' => now()],
            ['id' => (string) Str::uuid(), 'doll_product_id' => $elsa->getKey(), 'accessory_product_id' => $pelucaRubia->getKey(), 'is_mandatory' => false, 'group_name' => 'Cabello', 'created_at' => now(), 'updated_at' => now()],
            ['id' => (string) Str::uuid(), 'doll_product_id' => $elsa->getKey(), 'accessory_product_id' => $pelucaNegra->getKey(), 'is_mandatory' => false, 'group_name' => 'Cabello', 'created_at' => now(), 'updated_at' => now()],
        ], ['doll_product_id', 'accessory_product_id'], ['group_name', 'updated_at']);

        // ========================================
        // 4. PRODUCTOS GENERADOS CON FAKER
        // ========================================

        $allCategories = Category::all();

        if ($allCategories->isNotEmpty()) {
            $this->command->info('Verificando productos adicionales de demo...');
            $categories = $allCategories->values();

            foreach (range(1, 7) as $index) {
                $category = $categories->get(($index - 1) % $categories->count());

                $demoProduct = Product::updateOrCreate(
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
                    ]
                );
                $this->syncProductImages($demoProduct, [sprintf('https://placehold.co/800x800/EEE/333?text=Demo+%02d', $index)]);
                $this->syncProductCollections(
                    $demoProduct,
                    match ($index % 4) {
                        1 => ['para-ella'],
                        2 => ['para-el'],
                        3 => ['parejas'],
                        default => ['experiencias'],
                    }
                );
            }
        }

        $this->command->info('✅ ProductSeeder completado con éxito.');
    }

    /**
     * @param  array<int, string>  $imageUrls
     */
    private function syncProductImages(Product $product, array $imageUrls): void
    {
        ProductImage::query()->where('product_id', $product->getKey())->delete();

        foreach (array_values($imageUrls) as $index => $imageUrl) {
            ProductImage::query()->create([
                'product_id' => $product->getKey(),
                'public_id' => (string) Str::uuid(),
                'image_url' => $imageUrl,
                'alt_text' => $product->getAttribute('name'),
                'sort_order' => $index,
            ]);
        }
    }

    /**
     * @param  array<int, string>  $collectionSlugs
     */
    private function syncProductCollections(Product $product, array $collectionSlugs): void
    {
        $collections = Collection::query()
            ->whereIn('slug', $collectionSlugs)
            ->get(['id']);

        if ($collections->isEmpty()) {
            return;
        }

        CollectionProduct::query()
            ->where('product_id', $product->getKey())
            ->delete();

        foreach ($collections as $collection) {
            CollectionProduct::query()->firstOrCreate([
                'collection_id' => $collection->getKey(),
                'product_id' => $product->getKey(),
            ]);
        }
    }
}
