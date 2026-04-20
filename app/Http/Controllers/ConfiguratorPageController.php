<?php

namespace App\Http\Controllers;

use App\Domain\Media\Services\CloudinaryService;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ConfiguratorPageController extends Controller
{
    public function __construct(
        private readonly CloudinaryService $cloudinaryService,
        private readonly DollSettingsController $dollSettingsController,
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
        return Inertia::render('Configurator/DollConfigTest', [
            'views' => $this->getCachedViews(),
            'defaultSettings' => $this->dollSettingsController->getSettings(),
            'partPositions' => $this->dollSettingsController->getAllPartPositions(),
        ]);
    }

    private function getCachedViews()
    {
        // Read directly from cache (Pre-warmed by RefreshCloudinaryAssets command)
        return Cache::get('doll_parts_cloudinary', ['front' => [], 'back' => []]);
    }
}
