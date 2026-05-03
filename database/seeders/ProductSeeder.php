<?php

namespace Database\Seeders;

use App\Enums\ProductType;
use App\Models\Collection;
use App\Models\CollectionProduct;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (self::productDefinitions() as $definition) {
            $product = $this->upsertProduct($definition);

            $this->syncProductImages($product, $definition['images'] ?? []);
            $this->syncProductCollections($product, $definition['collections'] ?? []);
        }

        $this->command->info('ProductSeeder completado con catalogo demo declarativo.');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public static function productDefinitions(): array
    {
        return [
            [
                'sku' => 'SAT-PRO-001',
                'name' => 'Satisfyer Pro',
                'slug' => 'satisfyer-pro',
                'description' => 'Succionador de clitoris de Satisfyer',
                'base_price' => 39.99,
                'stock_quantity' => 50,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
                'is_promoted' => false,
                'is_adult_only' => true,
                'category_slug' => 'vibradores-externos',
                'images' => [
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1770982520/1_jkapuq.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771229829/3_ztpwsg.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771229829/2_rqoq4k.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771229830/5_vcog9t.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771229829/4_znbgsq.webp',
                ],
                'collections' => ['para-ella'],
            ],
            [
                'sku' => 'MINI-DIVA-001',
                'name' => 'Mini Diva',
                'slug' => 'mini-diva',
                'description' => 'Vibrador clitorial',
                'base_price' => 20.99,
                'stock_quantity' => 50,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
                'is_promoted' => false,
                'is_adult_only' => true,
                'category_slug' => 'vibradores-externos',
                'images' => [
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771230111/2_ah5dpa.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771230107/2.2_hv0gck.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771230107/2.3_ohpxxk.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771230107/2.1_kc3dez.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771230112/3_rfbm1j.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771230106/1_lyr2gd.webp',
                ],
                'collections' => ['para-ella'],
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $definition
     */
    private function upsertProduct(array $definition): Product
    {
        return Product::updateOrCreate(
            ['sku' => $definition['sku']],
            [
                'category_id' => $this->resolveCategoryId($definition['category_slug']),
                'name' => $definition['name'],
                'slug' => $definition['slug'],
                'description' => $definition['description'] ?? null,
                'base_price' => $definition['base_price'],
                'stock_quantity' => $definition['stock_quantity'],
                'product_type' => $definition['product_type'],
                'is_active' => $definition['is_active'] ?? true,
                'is_promoted' => $definition['is_promoted'] ?? false,
                'is_adult_only' => $definition['is_adult_only'] ?? true,
            ]
        );
    }

    private function resolveCategoryId(string $categorySlug): string
    {
        $categoryId = \App\Models\Category::query()
            ->where('slug', $categorySlug)
            ->value('id');

        if ($categoryId) {
            return $categoryId;
        }

        $fallbackCategoryId = \App\Models\Category::query()->value('id');

        if ($fallbackCategoryId) {
            return $fallbackCategoryId;
        }

        $this->command->error('No hay categorias en la base de datos. Abortando ProductSeeder.');
        abort(1, 'No categories found for ProductSeeder.');
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
        $collectionIds = Collection::query()
            ->whereIn('slug', $collectionSlugs)
            ->pluck('id');

        if ($collectionIds->isEmpty()) {
            return;
        }

        CollectionProduct::query()
            ->where('product_id', $product->getKey())
            ->delete();

        foreach ($collectionIds as $collectionId) {
            CollectionProduct::query()->firstOrCreate([
                'collection_id' => $collectionId,
                'product_id' => $product->getKey(),
            ]);
        }
    }
}
