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

        $this->command->info('ProductSeeder completado con catálogo demo declarativo.');
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
                'description' => 'El vibrador de parejas más versátil e inclusivo',
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
                'sku' => 'MOBI-001',
                'name' => 'Mobi',
                'slug' => 'mobi',
                'description' => 'Vibrador de parejas: Doble placer con control remoto',
                'base_price' => 54.99,
                'stock_quantity' => 50,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
                'is_promoted' => false,
                'is_adult_only' => true,
                'category_slug' => 'vibradores-externos',
                'images' => [
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771245881/1.1_rd03ji.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771246601/1_h7zucr.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771247321/2.2_ntj27j.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771578319/PM740_Mobi_Web_30_SPASH_plkxbh.webp',
                ],
                'collections' => ['parejas'],
            ],
            [
                'sku' => 'MORGAN-001',
                'name' => 'Morgan',
                'slug' => 'morgan',
                'description' => 'Vibrador conejito que simula la penetración',
                'base_price' => 49.99,
                'stock_quantity' => 50,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
                'is_promoted' => false,
                'is_adult_only' => true,
                'category_slug' => 'vibradores-internos',
                'images' => [
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771957114/morgan_lila_tecnica4_1024x1024_672fecf5-3cf4-4751-a6d6-c65aea5dbbb5_jnr5dv.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771957114/PM518-2_Morgan_Web_01_Tecnica_ABR_3_alm23s.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771957114/PM518-2_Morgan_Web_07_Creativa_zrqsxv.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771957114/PM518-2_Morgan_Web_09_Flexible_glwjeh.webp',
                ],
                'collections' => ['para-ella'],
            ],
            [
                'sku' => 'SUKI-001',
                'name' => 'Suki',
                'slug' => 'suki',
                'description' => 'Succionador de pezones',
                'base_price' => 14.99,
                'stock_quantity' => 50,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
                'is_promoted' => false,
                'is_adult_only' => true,
                'category_slug' => 'estimuladores-de-pezones',
                'images' => [
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771957381/PM902_SUKI_WEB_02_TECNICA_yv9nmx.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771957381/PM902_SUKI_WEB_04_MANO_nvo1qx.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771957381/PM902_SUKI_WEB_05_MANO_gucxmy.webp',
                ],
                'collections' => ['parejas'],
            ],
            [
                'sku' => 'LUBRICANTE-NEUTRO-001',
                'name' => 'Lubricante Neutro',
                'slug' => 'lubricante-neutro',
                'description' => 'Potencia el placer de tus momentos íntimos',
                'base_price' => 8.99,
                'stock_quantity' => 50,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
                'is_promoted' => false,
                'is_adult_only' => true,
                'category_slug' => 'lubricantes',
                'images' => [
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1772007803/Disenosintitulo_46_hfj90a.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1772007789/Disenosintitulo_45_nqfqhe.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1772007702/PM650_Lubricante_Neutro_Web_01_Mano_mhjw0m.webp',
                ],
                'collections' => ['parejas'],
            ],
            [
                'sku' => 'OH-001',
                'name' => 'Oh',
                'slug' => 'oh',
                'description' => 'Vibrador de parejas para jugar fuera de casa',
                'base_price' => 29.99,
                'stock_quantity' => 50,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
                'is_promoted' => false,
                'is_adult_only' => true,
                'category_slug' => 'vibradores-externos',
                'images' => [
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771958244/PM694-1_PM694-2_PM694-3_PM694-4_Oh_Web_05_Creativa_j8uuos.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771958263/PM820-1_OH_WEB_12_CALLE_txob4f.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771958266/oh_verde_CARGADOR_1024x1024_53ed8208-39db-4b7b-a696-d51b795879de_odixuh.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771958266/oh_violeta_tecnica1_MANDO_1024x1024_b90ea521-d040-4ff7-9972-49cb136baa93_qrv80w.webp',
                ],
                'collections' => ['parejas'],
            ],
            [
                'sku' => 'MOMBA-001',
                'name' => 'Momba',
                'slug' => 'momba',
                'description' => 'Succionador vibrador para placer intenso',
                'base_price' => 49.99,
                'stock_quantity' => 50,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
                'is_promoted' => false,
                'is_adult_only' => true,
                'category_slug' => 'vibradores-internos',
                'images' => [
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771958434/PM738_Momba_Web_06_Tecnica_aql0kp.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771958435/PM738_Momba_Web_07_Tecnica_fi3vsw.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771958458/PM738_Momba_Web_03_Tecnica_ABR_3_lfhvnw.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771958435/PM738_Momba_Web_20_Splash_lur9tj.webp',
                ],
                'collections' => ['para-ella'],
            ],
            [
                'sku' => 'BINI-001',
                'name' => 'Bini',
                'slug' => 'bini',
                'description' => 'Vibrador anal',
                'base_price' => 39.99,
                'stock_quantity' => 50,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
                'is_promoted' => false,
                'is_adult_only' => true,
                'category_slug' => 'vibradores-anales',
                'images' => [
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771958824/PM930_BINI_WEB_04_creativa_oerk4b.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771958820/PM930_BINI_WEB_10_SUMERGIBLE_etnbzo.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771958820/PM930_BINI_WEB_05_manos_sgast5.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771958821/PM930_BINI_WEB_06_con-mando_fh7uzm.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771958823/PM930_BINI_WEB_08_cargador_e8zxgb.webp',
                ],
                'collections' => ['para-el'],
            ],
            [
                'sku' => 'SAO-001',
                'name' => 'Sao',
                'slug' => 'sao',
                'description' => 'BDSM',
                'base_price' => 24.99,
                'stock_quantity' => 50,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
                'is_promoted' => false,
                'is_adult_only' => true,
                'category_slug' => 'impacto',
                'images' => [
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771957516/kit-bdsm-sao_hh0jzm.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771957516/PM512_Sao_Web_10_Manos_nhglfn.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1771957516/PM512_Sao_Web_09_Tecnica_prqort.webp',
                ],
                'collections' => ['experiencias'],
            ],
            [
                'sku' => 'COLLAR-BURLESQUE-001',
                'name' => 'Collar Burlesque',
                'slug' => 'collar-burlesque',
                'description' => 'Complementos lencería',
                'base_price' => 8.99,
                'stock_quantity' => 50,
                'product_type' => ProductType::Simple->value,
                'is_active' => true,
                'is_promoted' => false,
                'is_adult_only' => true,
                'category_slug' => 'cuero-y-textil',
                'images' => [
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1778092394/CollarCorset_02_zohj1e.webp',
                    'https://res.cloudinary.com/dquwonjie/image/upload/v1778092394/CollarCorset_01_qwllaz.webp',
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

        $this->command?->error('No hay categorías en la base de datos. Abortando ProductSeeder.');

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
