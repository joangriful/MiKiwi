<?php

namespace App\Http\Controllers;

use App\Domain\Dolls\Services\ConfigurableDollProductService;
use App\Domain\Dolls\Services\DollCustomizationService;
use App\Domain\Dolls\Services\DollSettingsService;
use App\Domain\Media\Services\CloudinaryService;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ConfiguratorPageController extends Controller
{
    public function __construct(
        private readonly CloudinaryService $cloudinaryService,
        private readonly DollSettingsController $dollSettingsController,
        private readonly DollSettingsService $dollSettingsService,
        private readonly ConfigurableDollProductService $configurableDollProductService,
        private readonly DollCustomizationService $dollCustomizationService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Configurator/Index');
    }

    public function collections(): Response
    {
        return Inertia::render('Configurator/Collections');
    }

    public function quiz(): Response
    {
        return Inertia::render('Configurator/Quiz');
    }

    public function dolls(): Response
    {
        return $this->renderDollConfigurator();
    }

    public function cart(): Response
    {
        return Inertia::render('Checkout/Cart');
    }

    public function dollConfigTest(): Response
    {
        return $this->renderDollConfigurator();
    }

    private function renderDollConfigurator(): Response
    {
        $config = $this->dollSettingsService->getConsolidatedConfiguration();
        $readyDollProducts = $this->configurableDollProductService->getReadyDollProducts();
        $product = $this->configurableDollProductService->getDefaultDollProduct() ?? $readyDollProducts->first();
        $views = $product ? $this->withAccessoryProducts($config['views'], $product) : $config['views'];

        return Inertia::render('Configurator/DollConfigTest', [
            'views' => $views,
            'defaultSettings' => $config['defaultSettings'],
            'partPositions' => $config['partPositions'],
            'dollProduct' => $product ? ProductResource::make($product)->resolve(request()) : null,
            'readyDollProducts' => ProductResource::collection(
                $readyDollProducts
            )->resolve(request()),
            'configuratorRules' => $this->dollCustomizationService->getFrontendRules(),
        ]);
    }

    /**
     * @param  array<string, mixed>  $views
     * @return array<string, mixed>
     */
    private function withAccessoryProducts(array $views, Product $baseDoll): array
    {
        $baseDoll->loadMissing(['accessories.images']);
        $accessoriesByPath = [];

        foreach ($baseDoll->accessories as $accessory) {
            $image = $accessory->images->sortBy('sort_order')->first();
            $path = $this->normalizeAssetPath((string) $image?->image_url);

            if ($path === '') {
                continue;
            }

            $accessoriesByPath[$path] = [
                'productId' => (string) $accessory->getKey(),
                'product_id' => (string) $accessory->getKey(),
                'slug' => (string) $accessory->slug,
                'sku' => (string) $accessory->sku,
                'label' => (string) $accessory->name,
                'price' => (float) $accessory->base_price,
                'isInStock' => (int) $accessory->stock_quantity > 0,
            ];
        }

        foreach ($views as $view => $categories) {
            foreach (($categories ?? []) as $category => $parts) {
                foreach (($parts ?? []) as $index => $part) {
                    if (! is_array($part)) {
                        continue;
                    }

                    $path = $this->normalizeAssetPath((string) ($part['thumbnail'] ?? $part['path'] ?? ''));
                    $accessory = $accessoriesByPath[$path] ?? null;

                    if (! $accessory) {
                        continue;
                    }

                    $views[$view][$category][$index] = array_merge($part, $accessory, [
                        'category' => (string) $category,
                        'view' => (string) $view,
                    ]);
                }
            }
        }

        return $views;
    }

    private function normalizeAssetPath(string $path): string
    {
        $path = trim($path);

        return $path === '' ? '' : '/'.ltrim($path, '/');
    }

    private function getCachedViews()
    {
        // Read directly from cache (Pre-warmed by RefreshCloudinaryAssets command)
        return Cache::get('doll_parts_cloudinary', ['front' => [], 'back' => []]);
    }
}
