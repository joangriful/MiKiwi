<?php

declare(strict_types=1);

namespace App\Domain\Marketing\Services;

use App\Domain\HeroImages\Repositories\Interfaces\HeroImageRepositoryInterface;

class MarketingPageService
{
    public function __construct(
        private readonly HeroImageRepositoryInterface $heroImageRepository,
    ) {}

    public function getSustainabilityPageData(): array
    {
        return [
            'heroImages' => $this->heroImageRepository->getActiveImagesBySection('sustainability'),
        ];
    }
}
