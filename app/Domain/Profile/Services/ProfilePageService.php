<?php

declare(strict_types=1);

namespace App\Domain\Profile\Services;

use App\Domain\Orders\Services\OrderService;
use App\Models\User;

class ProfilePageService
{
    public function __construct(
        private readonly ProfileRecommendationService $profileRecommendationService,
        private readonly OrderService $orderService,
    ) {
    }

    public function getPageData(?User $user): array
    {
        return [
            'recommendedProducts' => $this->profileRecommendationService->getRecommendationsForUser($user),
            'orders' => $user ? $this->orderService->getLatestUserOrders($user->id) : collect(),
        ];
    }
}
