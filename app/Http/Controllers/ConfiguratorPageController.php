<?php

namespace App\Http\Controllers;

use App\Domain\Dolls\Services\DollSettingsService;
use App\Domain\Media\Services\CloudinaryService;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ConfiguratorPageController extends Controller
{
    public function __construct(
        private readonly CloudinaryService $cloudinaryService,
        private readonly DollSettingsController $dollSettingsController,
        private readonly DollSettingsService $dollSettingsService,
    ) {
    }

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
        return Inertia::render('Configurator/DollConfigurator');
    }

    public function cart(): Response
    {
        return Inertia::render('Checkout/Cart');
    }

    public function dollConfigTest(): Response
    {
        $config = $this->dollSettingsService->getConsolidatedConfiguration();

        return Inertia::render('Configurator/DollConfigTest', [
            'views' => $config['views'],
            'defaultSettings' => $config['defaultSettings'],
            'partPositions' => $config['partPositions'],
        ]);
    }

    private function getCachedViews()
    {
        // Read directly from cache (Pre-warmed by RefreshCloudinaryAssets command)
        return Cache::get('doll_parts_cloudinary', ['front' => [], 'back' => []]);
    }
}
