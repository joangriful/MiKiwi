<?php

namespace App\Domain\Media\Services;

use Illuminate\Support\Facades\Cache;
use UnexpectedValueException;

class CloudinaryAssetCacheService
{
    public const DOLL_PARTS_CACHE_KEY = 'doll_parts_cloudinary';

    public const DOLL_CONFIG_CACHE_KEY = 'doll_config_consolidated';

    public function __construct(
        private readonly CloudinaryService $cloudinaryService,
    ) {}

    public function refreshDollParts(): array
    {
        $views = $this->cloudinaryService->listDollParts();

        if (empty($views['front']) && empty($views['back'])) {
            throw new UnexpectedValueException(
                'Cloudinary returned no doll parts. Cache was not overwritten.'
            );
        }

        Cache::forever(self::DOLL_PARTS_CACHE_KEY, $views);
        Cache::forget(self::DOLL_CONFIG_CACHE_KEY);

        return $views;
    }
}
