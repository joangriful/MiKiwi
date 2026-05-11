<?php

declare(strict_types=1);

namespace App\Domain\Admin\Services;

use App\Domain\Categories\Services\CategoryService;
use App\Domain\Dolls\Services\DollSettingsService;
use App\Domain\HeroImages\Repositories\Interfaces\HeroImageRepositoryInterface;
use App\Domain\Media\Services\CloudinaryService;
use App\Domain\Products\Services\ProductService;
use App\Domain\Reviews\Services\ReviewService;
use App\Models\HomeSectionImage;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ComponentsManagerPageService
{
    public function __construct(
        private readonly CloudinaryService $cloudinaryService,
        private readonly DollSettingsService $dollSettingsService,
        private readonly AdminUserService $adminUserService,
        private readonly HeroImageRepositoryInterface $heroImageRepository,
        private readonly ProductService $productService,
        private readonly CategoryService $categoryService,
        private readonly ReviewService $reviewService,
    ) {}

    public function getPageData(Request $request): array
    {
        $reviewManagerData = $this->reviewService->getAdminManagerData($request);

        return [
            'views' => $this->getCachedViews(),
            'defaultSettings' => $this->dollSettingsService->getSettings(),
            'partPositions' => $this->dollSettingsService->getAllPartPositions(),
            'users' => $this->adminUserService->getComponentsManagerUsers(),
            'heroImages' => $this->heroImageRepository->getAllOrdered(),
            'products' => $this->productService->getAdminProducts(),
            'reviewableProducts' => $reviewManagerData['products'],
            'reviews' => $reviewManagerData['reviews'],
            'categories' => $this->categoryService->getAdminAssignableCategories(),
            'collectionImages' => $this->getCollectionImages(),
        ];
    }

    private function getCachedViews(): array
    {
        $cacheDuration = app()->environment('local') ? 5 : 3600;

        return Cache::remember('doll_parts_cloudinary', $cacheDuration, function () {
            return $this->cloudinaryService->listDollParts();
        });
    }

    private function getCollectionImages(): Collection
    {
        return HomeSectionImage::query()
            ->with('imageHome')
            ->orderBy('sort_order')
            ->get();
    }
}
