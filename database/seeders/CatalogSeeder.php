<?php

namespace Database\Seeders;

use App\Enums\ProductType;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        // 1. TUS CATEGORÍAS (Mantenemos las tuyas y agregamos 'Componentes')
        $catDolls = Category::updateOrCreate(['slug' => 'dolls'], ['name' => 'Muñecas', 'is_active' => true]);
        $catToys = Category::updateOrCreate(['slug' => 'toys'], ['name' => 'Accesorios', 'is_active' => true]);
        $catComponents = Category::updateOrCreate(['slug' => 'components'], ['name' => 'Componentes', 'is_active' => true]);

        // 2. TU PRODUCTO SIMPLE (Lubricante)
        $lube = Product::updateOrCreate(
            ['sku' => 'LUBE-001'],
            [
                'category_id' => $catToys->getKey(),
                'name' => 'Lubricante 100ml',
                'slug' => 'lube-100',
                'base_price' => 15.00,
                'stock_quantity' => 50,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
            ]
        );
        $this->syncProductImages($lube, ['https://placehold.co/400?text=Lube']);

        // 3. TU MUÑECA CONFIGURABLE (Elsa)
        $elsa = Product::updateOrCreate(
            ['sku' => 'DOLL-001'],
            [
                'category_id' => $catDolls->getKey(),
                'name' => 'Muñeca Elsa',
                'slug' => 'elsa-doll',
                'base_price' => 1200.00,
                'stock_quantity' => 10,
                'product_type' => ProductType::Configurable->value,
                'is_active' => true,
            ]
        );
        $this->syncProductImages($elsa, ['https://placehold.co/400?text=Elsa']);

        // 4. NUEVO: CREAR COMPONENTES (Para probar el configurador)
        $ojosAzules = Product::updateOrCreate(
            ['sku' => 'COMP-EYE-BLU'],
            [
                'category_id' => $catComponents->getKey(),
                'name' => 'Ojos Azules Cristal',
                'slug' => 'ojos-azules',
                'base_price' => 50.00,
                'stock_quantity' => 100,
                'product_type' => ProductType::Component->value,
                'is_active' => true,
            ]
        );

        $pelucaRubia = Product::updateOrCreate(
            ['sku' => 'COMP-HAIR-BLND'],
            [
                'category_id' => $catComponents->getKey(),
                'name' => 'Peluca Rubia Larga',
                'slug' => 'peluca-rubia',
                'base_price' => 80.00,
                'stock_quantity' => 100,
                'product_type' => ProductType::Component->value,
                'is_active' => true,
            ]
        );

        // 5. NUEVO: LA RELACIÓN PIVOTE (La magia del configurador)
        // Esto permite que cuando llames al Repo, 'Elsa' traiga sus opciones.

        // Opción A: Si tienes la relación 'accessories' en el Modelo Product
        if (method_exists($elsa, 'accessories')) {
            $elsa->accessories()->syncWithoutDetaching([$ojosAzules->getKey(), $pelucaRubia->getKey()]);
        }
        // Opción B: Inserción manual en la tabla pivote (si no has definido la relación aún)
        else {
            // Asegúrate que la tabla se llame 'product_accessories' o la que hayas definido
            DB::table('doll_product_accessory')->upsert([
                ['doll_product_id' => $elsa->getKey(), 'accessory_product_id' => $ojosAzules->getKey(), 'created_at' => now(), 'updated_at' => now()],
                ['doll_product_id' => $elsa->getKey(), 'accessory_product_id' => $pelucaRubia->getKey(), 'created_at' => now(), 'updated_at' => now()],
            ], ['doll_product_id', 'accessory_product_id'], ['updated_at']);
        }

        // 6. RELLENO MASIVO (Para probar paginación y "Productos Relacionados")
        // Creamos 15 muñecas extra usando el Factory
        foreach (range(1, 15) as $index) {
            Product::updateOrCreate(
                ['sku' => sprintf('DOLL-DEMO-%03d', $index)],
                [
                    'category_id' => $catDolls->getKey(),
                    'name' => sprintf('Muñeca Demo %02d', $index),
                    'slug' => sprintf('muneca-demo-%02d', $index),
                    'base_price' => 900 + ($index * 25),
                    'stock_quantity' => 10,
                    'product_type' => ProductType::Configurable->value,
                    'is_active' => true,
                    'is_adult_only' => true,
                ]
            );
        }
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
}
