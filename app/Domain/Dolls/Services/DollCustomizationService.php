<?php

declare(strict_types=1);

namespace App\Domain\Dolls\Services;

use App\Enums\ProductType;
use App\Models\DollProductAccessory;
use App\Models\Product;

class DollCustomizationService
{
    private const OPTIONAL_CATEGORIES = [
        'complementos',
        'pecas',
        'ropa',
    ];

    private const PRESELECTED_CATEGORIES = [
        'cuerpo',
    ];

    private const REQUIRED_FRONT_CATEGORIES = [
        'boca',
        'cejas',
        'cuerpo',
        'manos',
        'nariz',
        'ojos',
        'orejas',
        'pechos',
        'pelo',
        'pies',
        'vagina',
        'vello',
        'vientre',
    ];

    private const CATEGORY_SURCHARGES = [
        'complementos' => 30.0,
        'ropa' => 50.0,
    ];

    private const PART_SURCHARGES = [
        '/images/doll_parts_ps/front/ojos/_0004s_0000s_0001s_0000_ojo4_delineado.png' => 50.0,
        '/images/doll_parts_ps/front/cejas/_0004s_0005s_0004s_0000_cejas3_delineado.png' => 20.0,
        '/images/doll_parts_ps/front/boca/_0004s_0004s_0000s_0000_boca8_delineado.png' => 40.0,
        '/images/doll_parts_ps/front/boca/_0004s_0004s_0006s_0000_boca2_delineado.png' => 50.0,
        '/images/doll_parts_ps/front/nariz/_0004s_0003s_0002s_0000_nariz3_delineado.png' => 100.0,
        '/images/doll_parts_ps/front/orejas/orejas2/_0001s_0004s_0000_orejas2_delineado.png' => 50.0,
        '/images/doll_parts_ps/front/orejas/orejas3/_0001s_0003s_0000_orejas3_delineado.png' => 50.0,
        '/images/doll_parts_ps/front/orejas/orejas5/_0001s_0001s_0000_orejas5_delineado.png' => 100.0,
        '/images/doll_parts_ps/front/orejas/orejas6/_0001s_0000s_0000_orejas6_delineado.png' => 200.0,
        '/images/doll_parts_ps/front/manos/manos3.png' => 200.0,
        '/images/doll_parts_ps/front/pies/pies1.png' => 200.0,
        '/images/doll_parts_ps/front/vientre/abs.png' => 150.0,
        '/images/doll_parts_ps/front/pechos/pechos5/_0000s_0003s_0000_pechos5_delineado.png' => 150.0,
        '/images/doll_parts_ps/front/pechos/pechos6/_0000s_0002s_0000_pechos6_delineado.png' => 300.0,
        '/images/doll_parts_ps/front/vagina/vagina1.png' => 50.0,
    ];

    public function getFrontendRules(): array
    {
        return [
            'optionalCategories' => self::OPTIONAL_CATEGORIES,
            'preselectedCategories' => self::PRESELECTED_CATEGORIES,
            'requiredFrontCategories' => self::REQUIRED_FRONT_CATEGORIES,
            'categorySurcharges' => self::CATEGORY_SURCHARGES,
            'partSurcharges' => self::PART_SURCHARGES,
        ];
    }

    public function validateConfiguration(array $configuration, ?Product $baseDollProduct = null, int $quantity = 1): void
    {
        $selectedParts = $this->extractSelectedParts($configuration);
        $resolvedAccessories = $this->resolveSelectedAccessories($selectedParts, $baseDollProduct, $quantity);
        $requiredCategories = $this->resolveRequiredFrontCategories($baseDollProduct);

        foreach ($requiredCategories as $category) {
            if (! isset($resolvedAccessories['front'][$category])) {
                throw new \InvalidArgumentException("Falta seleccionar la categoria obligatoria: {$category}.");
            }
        }
    }

    public function buildCartConfiguration(array $configuration, ?Product $baseDollProduct = null, int $quantity = 1): array
    {
        $selectedParts = $this->extractSelectedParts($configuration);
        $resolvedAccessories = $this->resolveSelectedAccessories($selectedParts, $baseDollProduct, $quantity);
        $requiredCategories = $this->resolveRequiredFrontCategories($baseDollProduct);
        $entries = [];
        $accessories = [];

        foreach ($requiredCategories as $category) {
            if (! isset($resolvedAccessories['front'][$category])) {
                throw new \InvalidArgumentException("Falta seleccionar la categoria obligatoria: {$category}.");
            }
        }

        foreach ($resolvedAccessories as $view => $categories) {
            foreach ($categories as $category => $resolvedAccessory) {
                $entry = $this->buildEntry($view, $category, $resolvedAccessory['part'], $resolvedAccessory['product']);
                $entries[] = $entry;
                $accessories[] = [
                    'product_id' => $entry['product_id'],
                    'sku' => $entry['sku'],
                    'name' => $entry['label'],
                    'category' => $category,
                    'view' => $view,
                    'quantity' => 1,
                    'unit_price' => $entry['extra_price'],
                    'visual_data_snapshot' => $resolvedAccessory['part'],
                ];
            }
        }

        usort($entries, fn (array $a, array $b): int => [$a['view'], $a['category'], $a['sku']] <=> [$b['view'], $b['category'], $b['sku']]);
        usort($accessories, fn (array $a, array $b): int => [$a['view'], $a['category'], $a['sku']] <=> [$b['view'], $b['category'], $b['sku']]);

        return [
            'selected_parts' => $selectedParts,
            'entries' => $entries,
            'accessories' => $accessories,
            'extra_price' => round(array_sum(array_column($entries, 'extra_price')), 2),
        ];
    }

    public function calculateUnitPrice(float $basePrice, array $configuration, ?Product $baseDollProduct = null, int $quantity = 1): float
    {
        $builtConfiguration = $this->buildCartConfiguration($configuration, $baseDollProduct, $quantity);

        return round($basePrice + (float) $builtConfiguration['extra_price'], 2);
    }

    /**
     * @return array<string, array<string, array<string, mixed>>>
     */
    private function extractSelectedParts(array $configuration): array
    {
        $selectedParts = $configuration['selected_parts'] ?? [];

        if (! is_array($selectedParts)) {
            throw new \InvalidArgumentException('La configuracion de la muñeca no es valida.');
        }

        $normalized = [];

        foreach ($selectedParts as $view => $categories) {
            if (! is_array($categories)) {
                continue;
            }

            foreach ($categories as $category => $part) {
                if (! is_array($part)) {
                    continue;
                }

                $partId = (string) ($part['id'] ?? '');
                $path = $this->normalizePath((string) ($part['path'] ?? $part['url'] ?? $part['thumbnail'] ?? ''));

                if ($partId === '' || $path === '') {
                    continue;
                }

                $normalized[(string) $view][(string) $category] = [
                    'id' => $partId,
                    'product_id' => (string) ($part['product_id'] ?? $part['productId'] ?? ''),
                    'sku' => (string) ($part['sku'] ?? ''),
                    'path' => $path,
                    'label' => (string) ($part['label'] ?? $partId),
                    'layers' => is_array($part['layers'] ?? null) ? $part['layers'] : [],
                ];
            }
        }

        return $normalized;
    }

    /**
     * @param  array<string, mixed>  $part
     * @return array<string, mixed>
     */
    private function buildEntry(string $view, string $category, array $part, Product $accessory): array
    {
        $path = $this->normalizePath((string) $part['path']);
        $extraPrice = (float) $accessory->base_price;

        return [
            'view' => $view,
            'category' => $category,
            'part_id' => (string) $part['id'],
            'product_id' => (string) $accessory->getKey(),
            'sku' => (string) $accessory->sku,
            'label' => (string) $accessory->name,
            'path' => $path,
            'extra_price' => $extraPrice,
            'has_special_price' => $extraPrice > 0,
        ];
    }

    private function resolveExtraPrice(string $category, string $path): float
    {
        if (array_key_exists($path, self::PART_SURCHARGES)) {
            return self::PART_SURCHARGES[$path];
        }

        return self::CATEGORY_SURCHARGES[$category] ?? 0.0;
    }

    /**
     * @return array<int, string>
     */
    private function resolveRequiredFrontCategories(?Product $baseDollProduct = null): array
    {
        $baseDollProduct = $this->resolveBaseDollProduct($baseDollProduct);

        $requiredCategories = DollProductAccessory::query()
            ->where('doll_product_id', $baseDollProduct->getKey())
            ->where('is_mandatory', true)
            ->whereNotNull('group_name')
            ->pluck('group_name')
            ->filter()
            ->unique()
            ->values()
            ->all();

        return $requiredCategories !== [] ? $requiredCategories : self::REQUIRED_FRONT_CATEGORIES;
    }

    /**
     * @param  array<string, array<string, array<string, mixed>>>  $selectedParts
     * @return array<string, array<string, array{part: array<string, mixed>, product: Product}>>
     */
    private function resolveSelectedAccessories(array $selectedParts, ?Product $baseDollProduct = null, int $quantity = 1): array
    {
        $baseDollProduct = $this->resolveBaseDollProduct($baseDollProduct);
        $compatibleAccessories = $this->getCompatibleAccessories($baseDollProduct);
        $resolved = [];

        foreach ($selectedParts as $view => $categories) {
            foreach ($categories as $category => $part) {
                $accessory = $this->findCompatibleAccessory($part, $compatibleAccessories);

                if (! $accessory) {
                    throw new \InvalidArgumentException("El accesorio seleccionado no es valido para la categoria {$category}.");
                }

                if (($accessory['group_name'] ?? null) !== null && $accessory['group_name'] !== $category) {
                    throw new \InvalidArgumentException("El accesorio seleccionado no pertenece a la categoria {$category}.");
                }

                $product = $accessory['product'];

                if ($product->stock_quantity < $quantity) {
                    throw new \InvalidArgumentException("No hay stock disponible para {$product->name}.");
                }

                $resolved[$view][$category] = [
                    'part' => $part,
                    'product' => $product,
                ];
            }
        }

        return $resolved;
    }

    private function resolveBaseDollProduct(?Product $baseDollProduct): Product
    {
        if ($baseDollProduct instanceof Product) {
            return $baseDollProduct;
        }

        $baseDollProduct = Product::query()
            ->where('sku', ConfigurableDollProductService::BASE_DOLL_SKU)
            ->first();

        if (! $baseDollProduct) {
            throw new \InvalidArgumentException('No hay una muñeca base configurable disponible.');
        }

        return $baseDollProduct;
    }

    /**
     * @return array{
     *     by_id: array<string, array{product: Product, group_name: string|null}>,
     *     by_sku: array<string, array{product: Product, group_name: string|null}>,
     *     by_path: array<string, array{product: Product, group_name: string|null}>
     * }
     */
    private function getCompatibleAccessories(Product $baseDollProduct): array
    {
        $byId = [];
        $bySku = [];
        $byPath = [];

        $rows = DollProductAccessory::query()
            ->where('doll_product_id', $baseDollProduct->getKey())
            ->whereHas('accessoryProduct', fn ($query) => $query
                ->active()
                ->where('product_type', ProductType::Accessory->value)
            )
            ->with(['accessoryProduct.images'])
            ->get();

        foreach ($rows as $row) {
            $product = $row->accessoryProduct;

            if (! $product) {
                continue;
            }

            $payload = [
                'product' => $product,
                'group_name' => $row->group_name,
            ];

            $byId[(string) $product->getKey()] = $payload;
            $bySku[(string) $product->sku] = $payload;

            foreach ($product->images as $image) {
                $path = $this->normalizePath((string) $image->image_url);

                if ($path !== '') {
                    $byPath[$path] = $payload;
                }
            }
        }

        return [
            'by_id' => $byId,
            'by_sku' => $bySku,
            'by_path' => $byPath,
        ];
    }

    /**
     * @param  array<string, mixed>  $part
     * @param  array<string, array<string, array{product: Product, group_name: string|null}>>  $compatibleAccessories
     * @return array{product: Product, group_name: string|null}|null
     */
    private function findCompatibleAccessory(array $part, array $compatibleAccessories): ?array
    {
        $productId = (string) ($part['product_id'] ?? '');

        if ($productId !== '' && isset($compatibleAccessories['by_id'][$productId])) {
            return $compatibleAccessories['by_id'][$productId];
        }

        $sku = (string) ($part['sku'] ?? '');

        if ($sku !== '' && isset($compatibleAccessories['by_sku'][$sku])) {
            return $compatibleAccessories['by_sku'][$sku];
        }

        foreach ($this->partPaths($part) as $path) {
            if (isset($compatibleAccessories['by_path'][$path])) {
                return $compatibleAccessories['by_path'][$path];
            }
        }

        return null;
    }

    /**
     * @param  array<string, mixed>  $part
     * @return array<int, string>
     */
    private function partPaths(array $part): array
    {
        $paths = [$this->normalizePath((string) ($part['path'] ?? ''))];

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
        $normalizedPath = trim($path);

        if ($normalizedPath === '') {
            return '';
        }

        if (str_starts_with($normalizedPath, 'src=')) {
            $normalizedPath = preg_replace('/^src=["\']?|["\']$/', '', $normalizedPath) ?? '';
        }

        return '/'.ltrim($normalizedPath, '/');
    }
}
