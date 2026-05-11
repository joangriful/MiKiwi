<?php

declare(strict_types=1);

namespace App\Domain\HeroImages\Services;

use App\Domain\HeroImages\Repositories\Interfaces\HeroImageRepositoryInterface;
use App\Domain\Media\Services\CloudinaryService;
use App\Models\ImageHome;

class HeroImageManagementService
{
    public function __construct(
        private readonly CloudinaryService $cloudinaryService,
        private readonly HeroImageRepositoryInterface $heroImageRepository,
    ) {}

    public function uploadImages(array $images, string $type = 'home'): int
    {
        $cloudinaryFolder = $this->resolveFolder($type);
        $uploadedCount = 0;

        foreach ($images as $image) {
            $cloudinaryResponse = $this->cloudinaryService->uploadImage($image, $cloudinaryFolder);

            $this->heroImageRepository->createFromCloudinary($cloudinaryResponse, [
                'type' => $type,
            ]);

            $uploadedCount++;
        }

        return $uploadedCount;
    }

    public function deleteImage(ImageHome $heroImage): void
    {
        $this->cloudinaryService->deleteImage($heroImage->public_id);
        $this->heroImageRepository->delete((string) $heroImage->id);
    }

    private function resolveFolder(string $type): string
    {
        $folderMap = [
            'home' => 'hero_images/home',
            'sustainability' => 'hero_images/sustainability',
            'dolls' => 'home/doll_home',
            'calibration' => 'home/calibracion',
        ];

        return $folderMap[$type] ?? 'hero_images/'.$type;
    }
}
