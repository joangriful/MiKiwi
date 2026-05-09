<?php

namespace Database\Seeders;

use App\Enums\ProductType;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PrefabDollSeeder extends Seeder
{
    public function run(): void
    {
        $category = Category::query()->updateOrCreate(
            ['slug' => 'munecas'],
            [
                'parent_id' => null,
                'name' => 'Muñecas',
                'description' => 'Muñecas listas para compra.',
                'is_active' => true,
            ],
        );

        foreach ($this->dolls() as $definition) {
            $product = Product::query()->updateOrCreate(
                ['sku' => $definition['sku']],
                [
                    'category_id' => $category->getKey(),
                    'name' => $definition['name'],
                    'slug' => $definition['slug'],
                    'description' => $definition['description'],
                    'base_price' => $definition['base_price'],
                    'stock_quantity' => $definition['stock_quantity'],
                    'product_type' => ProductType::Doll->value,
                    'is_adult_only' => true,
                    'is_active' => true,
                    'is_promoted' => $definition['is_promoted'],
                ],
            );

            $this->syncProductImages($product, $definition['images']);
        }
    }

    /**
     * @return array<int, array{
     *     sku: string,
     *     name: string,
     *     slug: string,
     *     description: string,
     *     base_price: float,
     *     stock_quantity: int,
     *     is_promoted: bool,
     *     images: array<int, string>
     * }>
     */
    private function dolls(): array
    {
        return [
            [
                'sku' => 'DOLL-QUEEN-001',
                'name' => 'Queen',
                'slug' => 'queen-doll',
                'description' => 'Muñeca Queen lista para compra directa.',
                'base_price' => 3000.00,
                'stock_quantity' => 20,
                'is_promoted' => true,
                'images' => ['/images/mannequin-base-skin.png'],
            ],
            [
                'sku' => 'DOLL-HAT-001',
                'name' => 'Hat',
                'slug' => 'hat-doll',
                'description' => 'Muñeca Hat lista para compra directa.',
                'base_price' => 3000.00,
                'stock_quantity' => 20,
                'is_promoted' => false,
                'images' => ['/images/mannequin-base-skin.png'],
            ],
            [
                'sku' => 'DOLL-BIKINI-001',
                'name' => 'Bikini',
                'slug' => 'bikini-doll',
                'description' => 'Muñeca Bikini lista para compra directa.',
                'base_price' => 3000.00,
                'stock_quantity' => 20,
                'is_promoted' => false,
                'images' => ['/images/mannequin-base-skin.png'],
            ],
            [
                'sku' => 'DOLL-WITCH-001',
                'name' => 'Witch',
                'slug' => 'witch-doll',
                'description' => 'Muñeca Witch lista para compra directa.',
                'base_price' => 3000.00,
                'stock_quantity' => 20,
                'is_promoted' => false,
                'images' => ['/images/mannequin-base-skin.png'],
            ],
        ];
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
                'alt_text' => $product->name,
                'sort_order' => $index,
            ]);
        }
    }
}
