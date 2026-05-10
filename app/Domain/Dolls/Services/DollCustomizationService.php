<?php

declare(strict_types=1);

namespace App\Domain\Dolls\Services;

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

    public function validateConfiguration(array $configuration): void
    {
        $selectedParts = $this->extractSelectedParts($configuration);
        $requiredCategories = $this->resolveRequiredFrontCategories($configuration);

        foreach ($requiredCategories as $category) {
            if (! isset($selectedParts['front'][$category])) {
                throw new \InvalidArgumentException("Falta seleccionar la categoria obligatoria: {$category}.");
            }
        }
    }

    public function buildCartConfiguration(array $configuration): array
    {
        $selectedParts = $this->extractSelectedParts($configuration);
        $entries = [];

        foreach ($selectedParts as $view => $categories) {
            foreach ($categories as $category => $part) {
                $entries[] = $this->buildEntry($view, $category, $part);
            }
        }

        usort($entries, fn (array $a, array $b): int => [$a['view'], $a['category'], $a['part_id']] <=> [$b['view'], $b['category'], $b['part_id']]);

        return [
            'selected_parts' => $selectedParts,
            'entries' => $entries,
            'extra_price' => round(array_sum(array_column($entries, 'extra_price')), 2),
        ];
    }

    public function calculateUnitPrice(float $basePrice, array $configuration): float
    {
        $builtConfiguration = $this->buildCartConfiguration($configuration);

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
                    'path' => $path,
                    'label' => (string) ($part['label'] ?? $partId),
                ];
            }
        }

        return $normalized;
    }

    /**
     * @param  array<string, mixed>  $part
     * @return array<string, mixed>
     */
    private function buildEntry(string $view, string $category, array $part): array
    {
        $path = $this->normalizePath((string) $part['path']);
        $extraPrice = $this->resolveExtraPrice($category, $path);

        return [
            'view' => $view,
            'category' => $category,
            'part_id' => (string) $part['id'],
            'label' => (string) ($part['label'] ?? $part['id']),
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
     * @param  array<string, mixed>  $configuration
     * @return array<int, string>
     */
    private function resolveRequiredFrontCategories(array $configuration): array
    {
        $availableFrontCategories = $configuration['available_front_categories'] ?? null;

        if (! is_array($availableFrontCategories) || $availableFrontCategories === []) {
            return self::REQUIRED_FRONT_CATEGORIES;
        }

        $normalizedAvailableCategories = array_values(array_filter(array_map(
            static fn (mixed $category): string => is_string($category) ? trim($category) : '',
            $availableFrontCategories,
        ), static fn (string $category): bool => $category !== ''));

        if ($normalizedAvailableCategories === []) {
            return self::REQUIRED_FRONT_CATEGORIES;
        }

        $optionalCategories = array_flip(self::OPTIONAL_CATEGORIES);
        $requiredCategories = array_values(array_filter(
            $normalizedAvailableCategories,
            static fn (string $category): bool => ! array_key_exists($category, $optionalCategories),
        ));

        if ($requiredCategories === []) {
            $requiredCategories = array_values(array_intersect(self::REQUIRED_FRONT_CATEGORIES, $normalizedAvailableCategories));
        }

        return $requiredCategories !== []
            ? $requiredCategories
            : self::REQUIRED_FRONT_CATEGORIES;
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
