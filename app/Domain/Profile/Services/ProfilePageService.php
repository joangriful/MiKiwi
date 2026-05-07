<?php

declare(strict_types=1);

namespace App\Domain\Profile\Services;

use App\Domain\Orders\Services\OrderService;
use App\Http\Resources\ProductResource;
use App\Models\User;
use Illuminate\Http\Request;

class ProfilePageService
{
    public function __construct(
        private readonly ProfileRecommendationService $profileRecommendationService,
        private readonly ProfileFavoriteService $profileFavoriteService,
        private readonly OrderService $orderService,
    ) {}

    public function getPageData(?User $user, Request $request): array
    {
        $recommendedProducts = $this->profileRecommendationService->getRecommendationsForUser($user);

        return [
            'recommendedProducts' => ProductResource::collection($recommendedProducts)->resolve($request),
            'favoriteProducts' => $user
                ? ProductResource::collection($this->profileFavoriteService->getFavoriteProductsForUser($user))->resolve($request)
                : [],
            'orders' => $user ? $this->orderService->getLatestUserOrders($user->id) : collect(),
        ];
    }
}
