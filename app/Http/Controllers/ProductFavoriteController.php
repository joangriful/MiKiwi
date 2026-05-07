<?php

namespace App\Http\Controllers;

use App\Domain\Products\Services\ProductFavoriteService;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductFavoriteController extends Controller
{
    public function __construct(
        private readonly ProductFavoriteService $productFavoriteService,
    ) {}

    public function store(Request $request, Product $product): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $this->productFavoriteService->add($user, $product);

        return response()->json([
            'success' => true,
            'is_favorite' => true,
        ]);
    }

    public function destroy(Request $request, Product $product): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $this->productFavoriteService->remove($user, $product);

        return response()->json([
            'success' => true,
            'is_favorite' => false,
        ]);
    }
}
