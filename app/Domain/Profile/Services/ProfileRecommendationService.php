<?php

declare(strict_types=1);

namespace App\Domain\Profile\Services;

use App\Domain\Products\Services\ProductService;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class ProfileRecommendationService
{
    private const QUIZ_CATEGORY_MAP = [
        'Succionadores' => 'para-ella',
        'Estimuladores de Punto G' => 'para-ella',
        'Vibradores Externos' => 'para-ella',
        'Varitas vibratorias' => 'para-ella',
        'Estimuladores de Pezones' => 'para-ella',
        'Estimulación Interna' => 'para-ella',
        'Dildos' => 'para-ella',
        'Vibradores Internos' => 'para-ella',
        'Arneses y Strapless' => 'para-ella',
        'Salud Íntima' => 'para-ella',
        'Bienestar Íntimo' => 'para-ella',
        'Masturbadores' => 'para-el',
        'Anillos Vibradores' => 'para-el',
        'Bombas de Vacío' => 'para-el',
        'Estimuladores de Próstata' => 'para-el',
        'Pene y Testículos' => 'para-el',
        'Sensaciones' => 'parejas',
        'Cosmética y Cuidado' => 'parejas',
        'Lubricantes' => 'parejas',
        'Cuidado del Cuerpo' => 'parejas',
        'Higiene' => 'parejas',
        'Estimulación Anal' => 'parejas',
        'Plugs Anales' => 'parejas',
        'Cuentas y Bolas Anales' => 'parejas',
        'Dilatadores y Kits de Inicio' => 'parejas',
        'Vibradores Anales' => 'parejas',
        'BDSM y Fetiche' => 'experiencias',
        'Cuero y Textil' => 'experiencias',
        'Impacto' => 'experiencias',
        'Restricción' => 'experiencias',
    ];

    public function __construct(
        private readonly ProductService $productService,
    ) {}

    public function getRecommendationsForUser(?User $user, int $limit = 4): Collection
    {
        if (! $user || ! $user->quiz_result_category) {
            return $this->getFallbackRecommendations($limit);
        }

        $categoryName = trim($user->quiz_result_category);
        Log::info('Quiz Result Category to match:', ['category' => $categoryName]);

        $collectionSlug = self::QUIZ_CATEGORY_MAP[$categoryName] ?? null;

        if (! $collectionSlug) {
            Log::info('No collection mapping found for quiz result:', ['category' => $categoryName]);

            return $this->getFallbackRecommendations($limit);
        }

        Log::info('Collection slug to search:', ['slug' => $collectionSlug]);

        $products = $this->productService->getRecommendedProductsByCollectionSlug($collectionSlug, $limit);

        if ($products->isNotEmpty()) {
            Log::info('Found products via collection:', ['count' => $products->count()]);

            return $products;
        }

        Log::info('No products found for collection');

        return $this->getFallbackRecommendations($limit);
    }

    private function getFallbackRecommendations(int $limit): Collection
    {
        Log::info('No recommended products found, falling back to featured products');

        $featuredProducts = $this->productService->getRandomFeaturedProducts($limit);

        if ($featuredProducts->isNotEmpty()) {
            return $featuredProducts;
        }

        Log::info('No featured products, falling back to latest products');

        return $this->productService->getLatestAvailableProducts($limit);
    }
}
