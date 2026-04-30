<?php

declare(strict_types=1);

namespace App\Domain\Home\Services;

use App\Domain\Products\Services\ProductService;
use App\Domain\HeroImages\Repositories\Interfaces\HeroImageRepositoryInterface;
use App\Models\HomeSectionImage;
use Illuminate\Database\Eloquent\Collection;

class HomePageService
{
    public function __construct(
        private readonly HeroImageRepositoryInterface $heroImageRepository,
        private readonly ProductService $productService,
    ) {
    }

    public function getPageData(): array
    {
        return [
            'heroImages' => $this->heroImageRepository->getAllOrdered(),
            'featuredProducts' => $this->productService->getFeaturedProducts(),
            'collectionImages' => $this->getCollectionImages(),
        ];
    }

    private function getCollectionImages(): Collection
    {
        return HomeSectionImage::query()
            ->with('imageHome')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();
    }
}
