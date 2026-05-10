<?php

namespace Database\Seeders;

use App\Domain\Dolls\Services\DollCustomizationService;
use App\Domain\Dolls\Services\LocalDollPartLibraryService;
use App\Enums\ProductType;
use App\Models\Category;
use App\Models\DollProductAccessory;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ConfiguratorAccessorySeeder extends Seeder
{
    private const BASE_DOLL_SKU = 'DOLL-BASE-001';

    private const DEFAULT_STOCK = 100;

    private const VIEW_LABELS = [
        'front' => 'frontal',
        'back' => 'trasera',
    ];

    public function run(): void
    {
        $baseDoll = Product::query()->where('sku', self::BASE_DOLL_SKU)->first();

        if (! $baseDoll) {
            $this->command?->warn('No se encontraron accesorios del configurador porque no existe DOLL-BASE-001.');

            return;
        }

        $category = Category::query()->updateOrCreate(
            ['slug' => 'accesorios-muneca'],
            [
                'parent_id' => null,
                'name' => 'Accesorios de muñeca',
                'description' => 'Piezas seleccionables para el configurador de muñecas.',
                'is_active' => true,
            ],
        );

        $rules = app(DollCustomizationService::class)->getFrontendRules();
        $views = app(LocalDollPartLibraryService::class)->listDollParts();
        $requiredCategories = array_flip($rules['requiredFrontCategories'] ?? []);

        foreach ($views as $view => $categories) {
            foreach ($categories as $groupName => $parts) {
                foreach ($parts as $part) {
                    $thumbnail = $this->normalizePath((string) ($part['thumbnail'] ?? ''));

                    if ($thumbnail === '') {
                        continue;
                    }

                    $sku = $this->buildSku($view, $groupName, (string) $part['id']);
                    $name = $this->buildName($view, $groupName, (string) $part['id']);
                    $price = $this->resolvePrice($groupName, $part, $rules);

                    $accessory = Product::query()->updateOrCreate(
                        ['sku' => $sku],
                        [
                            'category_id' => $category->getKey(),
                            'name' => $name,
                            'slug' => $this->buildSlug($view, $groupName, (string) $part['id'], $sku),
                            'description' => "Accesorio {$groupName} para la vista {$view} del configurador.",
                            'base_price' => $price,
                            'stock_quantity' => self::DEFAULT_STOCK,
                            'product_type' => ProductType::Accessory->value,
                            'is_adult_only' => true,
                            'is_active' => true,
                            'is_promoted' => false,
                        ],
                    );

                    ProductImage::query()->updateOrCreate(
                        [
                            'product_id' => $accessory->getKey(),
                            'sort_order' => 0,
                        ],
                        [
                            'public_id' => 'seed-configurator-accessory-'.$sku,
                            'image_url' => $thumbnail,
                            'alt_text' => $name,
                        ],
                    );

                    DollProductAccessory::query()->updateOrCreate(
                        [
                            'doll_product_id' => $baseDoll->getKey(),
                            'accessory_product_id' => $accessory->getKey(),
                        ],
                        [
                            'group_name' => $groupName,
                            'is_mandatory' => array_key_exists($groupName, $requiredCategories),
                        ],
                    );
                }
            }
        }
    }

    private function buildSku(string $view, string $groupName, string $partId): string
    {
        $hash = substr(sha1("{$view}|{$groupName}|{$partId}"), 0, 10);

        return strtoupper("ACC-{$view}-{$groupName}-{$hash}");
    }

    private function buildSlug(string $view, string $groupName, string $partId, string $sku): string
    {
        $partSlug = Str::limit(Str::slug($partId), 80, '');

        return Str::slug("configurator {$view} {$groupName} {$partSlug} {$sku}");
    }

    private function buildName(string $view, string $groupName, string $partId): string
    {
        $category = (string) Str::of($groupName)->replace(['_', '-'], ' ')->headline();
        $option = $this->humanizePartId($partId);
        $viewLabel = self::VIEW_LABELS[$view] ?? $view;

        return sprintf(
            '%s %s (%s)',
            $category,
            $option,
            $viewLabel,
        );
    }

    private function humanizePartId(string $partId): string
    {
        $normalized = Str::of($partId)
            ->replaceMatches('/^doll_/', '')
            ->replaceMatches('/_?delineado$/', '')
            ->replaceMatches('/_?BLANCO$/i', ' blanco')
            ->replace(['_', '-'], ' ')
            ->replaceMatches('/\b\d+s\b/', '')
            ->replaceMatches('/\s+/', ' ')
            ->trim();

        if ($normalized->isEmpty()) {
            return 'personalizado';
        }

        $value = $normalized->toString();

        if (preg_match('/([a-záéíóúñ]+)\s*(\d+)$/i', $value, $matches) === 1) {
            return sprintf('opción %s', $matches[2]);
        }

        if (preg_match('/\b(\d+)\b/', $value, $matches) === 1) {
            return sprintf('opción %s', $matches[1]);
        }

        return (string) Str::of($value)->headline()->lower();
    }

    /**
     * @param  array<string, mixed>  $part
     * @param  array<string, mixed>  $rules
     */
    private function resolvePrice(string $groupName, array $part, array $rules): float
    {
        $partSurcharges = $rules['partSurcharges'] ?? [];

        foreach ($this->partPaths($part) as $path) {
            if (isset($partSurcharges[$path])) {
                return (float) $partSurcharges[$path];
            }
        }

        return (float) (($rules['categorySurcharges'] ?? [])[$groupName] ?? 0);
    }

    /**
     * @param  array<string, mixed>  $part
     * @return array<int, string>
     */
    private function partPaths(array $part): array
    {
        $paths = [$this->normalizePath((string) ($part['thumbnail'] ?? ''))];

        foreach (($part['layers'] ?? []) as $layer) {
            if (! is_array($layer)) {
                continue;
            }

            $paths[] = $this->normalizePath((string) ($layer['url'] ?? ''));
        }

        return array_values(array_filter(array_unique($paths)));
    }

    private function normalizePath(string $path): string
    {
        $path = trim($path);

        return $path === '' ? '' : '/'.ltrim($path, '/');
    }
}
