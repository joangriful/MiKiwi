<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Collection;
use App\Models\CollectionProduct;
use App\Models\Product;
use Illuminate\Database\Seeder;

class LinkCollectionsToExistingCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        $collections = Collection::query()
            ->whereIn('slug', ['para-ella', 'para-el', 'parejas', 'experiencias'])
            ->get()
            ->keyBy('slug');

        if ($collections->count() !== 4) {
            $this->command->error('❌ Collections not found. Run CollectionCategoriesSeeder first.');
            return;
        }

        $collectionCategoryMap = [
            'para-ella' => [
                'estimulacion-externa',
                'ondas-de-presion',
                'vibradores-externos',
                'wands-de-masaje',
                'estimuladores-de-pezones',
                'estimulacion-interna',
                'estimuladores-de-punto-g',
                'dildos',
                'vibradores-internos',
                'arneses-y-strapless',
                'salud-intima',
                'estimulacion-anal',
                'plugs-anales',
                'dilatadores-y-kits-de-inicio',
                'cuentas-y-bolas-anales',
                'vibradores-anales',
            ],
            'para-el' => [
                'pene-y-testiculos',
                'masturbadores',
                'anillos-vibradores',
                'bombas-de-vacio',
                'estimuladores-de-prostata',
            ],
            'experiencias' => [
                'bdsm-y-fetiche',
                'cuero-y-textil',
                'impacto',
                'restriccion',
                'sensaciones',
            ],
            'parejas' => [
                'estimulacion-externa',
                'ondas-de-presion',
                'vibradores-externos',
                'wands-de-masaje',
                'estimuladores-de-pezones',
                'estimulacion-interna',
                'estimuladores-de-punto-g',
                'dildos',
                'vibradores-internos',
                'arneses-y-strapless',
                'salud-intima',
                'estimulacion-anal',
                'plugs-anales',
                'dilatadores-y-kits-de-inicio',
                'cuentas-y-bolas-anales',
                'vibradores-anales',
                'pene-y-testiculos',
                'masturbadores',
                'anillos-vibradores',
                'bombas-de-vacio',
                'estimuladores-de-prostata',
                'cosmetica-y-cuidado',
                'lubricantes',
                'cuidado-del-cuerpo',
                'higiene',
            ],
        ];

        $createdLinks = 0;

        foreach ($collectionCategoryMap as $collectionSlug => $categorySlugs) {
            $collection = $collections->get($collectionSlug);
            $categoryIds = Category::query()
                ->whereIn('slug', $categorySlugs)
                ->pluck('id');

            if ($categoryIds->isEmpty()) {
                continue;
            }

            $productIds = Product::query()
                ->whereIn('category_id', $categoryIds)
                ->pluck('id');

            foreach ($productIds as $productId) {
                CollectionProduct::query()->updateOrCreate(
                    [
                        'collection_id' => $collection->getKey(),
                        'product_id' => $productId,
                    ],
                    []
                );

                $createdLinks++;
            }

            $this->command->line(sprintf('  ✓ %s vinculada a %d productos', $collectionSlug, $productIds->count()));
        }

        $this->command->info("✅ LinkCollectionsToExistingCategoriesSeeder completado: {$createdLinks} vínculos collection_product verificados/creados.");
    }
}
