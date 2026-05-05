<?php

namespace Database\Seeders;

use App\Domain\Products\Support\ProductImageUrlNormalizer;
use App\Enums\ProductType;
use App\Models\Category;
use App\Models\Collection;
use App\Models\CollectionProduct;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use RuntimeException;

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
                'category_slug' => 'wands-de-masaje',
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
            [
                'sku' => 'MAMBO-LUCAS-001',
                'name' => 'Mambo + Lucas',
                'slug' => 'mambo-lucas',
                'description' => 'Mambo + Lucas Edición Limitada es el kit perfecto para ayudarte a que te conozcas más a ti y te dejes llevar por el placer.',
                'base_price' => 59.99,
                'stock_quantity' => 50,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
                'is_promoted' => false,
                'is_adult_only' => true,
                'category_slug' => 'estimuladores-de-punto-g',
                'images' => [
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771230347/2.2_sdtlj7.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771230347/2.1_rko7rc.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771230377/4.2_fqmxux.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771230377/4_hfdcty.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771230377/5_eyynkq.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771230378/2.1_ilrq69.webp',
                ],
                'collections' => ['para ella'],
            ],
            [
                'sku' => 'MAMBO-001',
                'name' => 'Mambo',
                'slug' => 'mambo',
                'description' => 'Succionador de clítoris progresivo e intenso',
                'base_price' => 27.99,
                'stock_quantity' => 50,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
                'is_promoted' => false,
                'is_adult_only' => true,
                'category_slug' => 'vibradores-externos',
                'images' => [
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231026/3_gpqlwy.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231035/MamboLavanda.2.1_c_mtnjnl.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231027/MamboCeleste.2.1_c_cifypo.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231039/1_r4wucs.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231032/MamboFucsia.2.1_c_ph2ah0.webp',
                ],
                'collections' => ['para-ella'],
            ],
            [
                'sku' => 'KISU-001',
                'name' => 'Kisu',
                'slug' => 'kisu',
                'description' => 'Vibrador mini',
                'base_price' => 19.99,
                'stock_quantity' => 50,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
                'is_promoted' => false,
                'is_adult_only' => true,
                'category_slug' => 'estimulacion-externa',
                'images' => [
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231174/1_ztqeqk.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231178/4_onwroq.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231174/2_rrxjic.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231181/5_ui4tc2.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231184/7_iit3wu.webp',
                ],
                'collections' => ['para-ella'],
            ],
            [
                'sku' => 'ISA-001',
                'name' => 'Isa',
                'slug' => 'isa',
                'description' => 'Vibrador doble sin correas ni ataduras',
                'base_price' => 39.99,
                'stock_quantity' => 50,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
                'is_promoted' => true,
                'is_adult_only' => true,
                'category_slug' => 'dildos',
                'images' => [
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231288/1_r1himt.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231292/4_w0cebc.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231284/2_emsfg7.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231286/3_wm0i6w.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231293/2.1_vesj1y.webp',
                ],
                'collections' => ['para-ella'],
            ],
            [
                'sku' => 'HARRY-001',
                'name' => 'Harry',
                'slug' => 'harry',
                'description' => 'Dildo con ventosa',
                'base_price' => 14.99,
                'stock_quantity' => 50,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
                'is_promoted' => true,
                'is_adult_only' => true,
                'category_slug' => 'plugs-anales',
                'images' => [
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231395/1_hsdn0c.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231398/2_kvdlqv.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231400/3_jrcdjb.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231402/4_xoqyhb.webp',
                ],
                'collections' => ['parejas'],
            ],
            [
                'sku' => 'CRABY-001',
                'name' => 'Craby',
                'slug' => 'craby',
                'description' => 'El vibrador de parejas mas versatil e inclusivo',
                'base_price' => 39.99,
                'stock_quantity' => 50,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
                'is_promoted' => true,
                'is_adult_only' => true,
                'category_slug' => 'estimuladores-de-punto-g',
                'images' => [
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231525/1_rpshgn.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231525/2_vw0why.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231525/3_rq8kcn.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231525/4_wyhszo.webp',
                ],
                'collections' => ['parejas'],
            ],
            [
                'sku' => 'BLENDY-001',
                'name' => 'Blendy',
                'slug' => 'blendy',
                'description' => 'Vibrador clitorial',
                'base_price' => 24.99,
                'stock_quantity' => 50,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
                'is_promoted' => false,
                'is_adult_only' => true,
                'category_slug' => 'vibradores-externos',
                'images' => [
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231684/4_xqg1ak.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231685/1_srlvmi.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231685/2_pvpe7s.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771231687/3_tvq8pa.webp',
                ],
                'collections' => ['para-ella'],
            ],
            [
                'sku' => 'LUMBRA-001',
                'name' => 'Lumbra',
                'slug' => 'lumbra',
                'description' => 'Un masturbador para pene con efecto calor',
                'base_price' => 24.99,
                'stock_quantity' => 50,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
                'is_promoted' => false,
                'is_adult_only' => true,
                'category_slug' => 'masturbadores',
                'images' => [
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771232612/7-masturbador.16_nloibh.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771232551/PM642_Lumbra_Web_17_Manos_vzolww.webp',
                ],
                'collections' => ['para-el'],
            ],
            [
                'sku' => 'BALI-001',
                'name' => 'Bali',
                'slug' => 'bali',
                'description' => 'Vibrador potente para estimular zonas erógenas',
                'base_price' => 16.99,
                'stock_quantity' => 50,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
                'is_promoted' => false,
                'is_adult_only' => true,
                'category_slug' => 'sensaciones',
                'images' => [
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771235062/bali_tecnica1_AZUL_1024x1024_f73a9268-122b-464c-9242-2801f2706e7d_xvhi13.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771235063/PM695-1_Bali_Web_04_Manos_bzr3mv.webp',
                ],
                'collections' => ['parejas'],
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
        $categoryId = Category::query()
            ->where('slug', $categorySlug)
            ->value('id');

        if ($categoryId) {
            return $categoryId;
        }

        $fallbackCategoryId = Category::query()->value('id');

        if ($fallbackCategoryId) {
            return $fallbackCategoryId;
        }

        $this->command?->error('No hay categorias en la base de datos. Abortando ProductSeeder.');

        throw new RuntimeException('No categories found for ProductSeeder.');
    }

    private function syncProductImages(Product $product, mixed $imagePayload): void
    {
        ProductImage::query()->where('product_id', $product->getKey())->delete();

        foreach (ProductImageUrlNormalizer::normalize($imagePayload) as $index => $imageUrl) {
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
