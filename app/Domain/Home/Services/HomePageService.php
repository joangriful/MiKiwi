<?php

namespace App\Domain\Home\Services;

use App\Domain\Products\Services\ProductService;
use App\Domain\HeroImages\Repositories\Interfaces\HeroImageRepositoryInterface;

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

    private function getCollectionImages()
    {
        $homeCollectionImageModel = 'App\\Models\\HomeCollectionImage';

        return class_exists($homeCollectionImageModel)
            ? $homeCollectionImageModel::all()
            : collect();
    }
}
