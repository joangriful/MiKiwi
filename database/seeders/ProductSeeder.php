<?php

namespace Database\Seeders;

use App\Enums\ProductType;
use App\Models\Category;
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
        $category = Category::query()
            ->where('slug', 'vibradores-externos')
            ->first() ?? Category::query()->first();

        if (! $category) {
            $this->command->error('No hay categorias en la base de datos. Abortando ProductSeeder.');

            return;
        }

        $product = Product::updateOrCreate(
            ['sku' => 'SAT-PRO-001'],
            [
                'category_id' => $category->getKey(),
                'name' => 'Satisfyer Pro',
                'slug' => 'satisfyer-pro',
                'description' => 'Succionador de clitoris de Satisfyer',
                'base_price' => 39.99,
                'stock_quantity' => 50,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
                'is_promoted' => false,
                'is_adult_only' => true,
            ]
        );

        $this->syncProductImages($product, [
            'https://res.cloudinary.com/dquwonjie/image/upload/v1770982520/1_jkapuq.webp',
            'https://res.cloudinary.com/dquwonjie/image/upload/v1771229829/3_ztpwsg.webp',
            'https://res.cloudinary.com/dquwonjie/image/upload/v1771229829/2_rqoq4k.webp',
            'https://res.cloudinary.com/dquwonjie/image/upload/v1771229830/5_vcog9t.webp',
            'https://res.cloudinary.com/dquwonjie/image/upload/v1771229829/4_znbgsq.webp',
        ]);
        $this->syncProductCollections($product, ['para-ella']);

        $this->command->info('ProductSeeder completado con un unico producto real.');
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
