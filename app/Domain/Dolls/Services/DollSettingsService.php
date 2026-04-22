<?php

namespace App\Domain\Dolls\Services;

use App\Domain\Media\Services\CloudinaryAssetCacheService;
use App\Models\DollSetting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DollSettingsService
{
    public function __construct(
        private readonly LocalDollPartLibraryService $localDollPartLibraryService,
    ) {}

    public function getSettings(): array
    {
        try {
            $setting = DollSetting::query()->find('default_config');

            return $setting?->value ?? [];
        } catch (\Exception $e) {
            Log::error('Failed to get doll settings from DB: '.$e->getMessage());

            return [];
        }
    }

    public function saveSettings(array $settings): bool
    {
        try {
            DollSetting::query()->updateOrCreate(
                ['key' => 'default_config'],
                ['value' => $settings]
            );

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to save doll settings to DB: '.$e->getMessage());

            return false;
        }
    }

    public function getAllPartPositions(): array
    {
        try {
            $positions = DB::table('doll_part_positions')->get();
            $formatted = [];

            foreach ($positions as $position) {
                $key = "{$position->view}|{$position->category}|{$position->part_id}";
                $formatted[$key] = [
                    'x' => $position->x,
                    'y' => $position->y,
                    'scale' => $position->scale,
                ];
            }

            return $formatted;
        } catch (\Exception $e) {
            Log::error('Failed to get part positions: '.$e->getMessage());

            return [];
        }
    }

    public function savePartPosition(array $position): bool
    {
        try {
            DB::table('doll_part_positions')->updateOrInsert(
                [
                    'part_id' => $position['part_id'],
                    'category' => $position['category'],
                    'view' => $position['view'],
                ],
                [
                    'x' => $position['x'],
                    'y' => $position['y'],
                    'scale' => $position['scale'],
                    'updated_at' => now(),
                ]
            );

            // Invalidate consolidated cache on change
            Cache::forget('doll_config_consolidated');

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to save part position: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Get everything needed for the configurator in a single cached call.
     * Targets < 400ms TTFB.
     */
    public function getConsolidatedConfiguration(): array
    {
        $cachedConfig = Cache::get(CloudinaryAssetCacheService::DOLL_CONFIG_CACHE_KEY);

        if (
            is_array($cachedConfig)
            && $this->hasConfiguredViews($cachedConfig['views'] ?? [])
        ) {
            return $cachedConfig;
        }

        $config = [
            'views' => $this->getConfiguredViews(),
            'defaultSettings' => $this->getSettings(),
            'partPositions' => $this->getAllPartPositions(),
        ];

        Cache::put(CloudinaryAssetCacheService::DOLL_CONFIG_CACHE_KEY, $config, 3600);

        return $config;
    }

    private function hasConfiguredViews(array $views): bool
    {
        $categories = array_merge(
            array_keys($views['front'] ?? []),
            array_keys($views['back'] ?? [])
        );

        return count(array_intersect($categories, [
            'boca',
            'cejas',
            'cuerpo',
            'manos',
            'ojos',
            'orejas',
            'pechos',
            'pelo',
            'pies',
            'ropa',
            'vientre',
        ])) > 0;
    }

    private function getConfiguredViews(): array
    {
        $views = Cache::get(CloudinaryAssetCacheService::DOLL_PARTS_CACHE_KEY, ['front' => [], 'back' => []]);

        return $this->hasConfiguredViews($views)
            ? $views
            : $this->localDollPartLibraryService->listDollParts();
    }
}
