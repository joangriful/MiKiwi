<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Domain\Reviews\Services\ReviewService;
use App\Http\Requests\StoreReviewRequest;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class ReviewController extends Controller
{
    public function __construct(
        private readonly ReviewService $reviewService,
    ) {}

    public function store(StoreReviewRequest $request, Product $product): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $this->reviewService->createUserReview($user, $product, $request->validated());

        return back()->with('success', 'Reseña enviada para revisión.');
    }
}
