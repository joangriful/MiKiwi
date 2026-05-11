<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Domain\Reviews\Services\ReviewService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAdminReviewRequest;
use App\Http\Requests\Admin\UpdateAdminReviewRequest;
use App\Http\Resources\Admin\AdminReviewResource;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReviewManagerController extends Controller
{
    public function __construct(
        private readonly ReviewService $reviewService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Review::class);

        return response()->json([
            'reviews' => AdminReviewResource::collection($this->reviewService->getAdminReviews())->resolve($request),
        ]);
    }

    public function store(StoreAdminReviewRequest $request): RedirectResponse
    {
        /** @var User $admin */
        $admin = $request->user();

        $this->reviewService->createAsAdmin($admin, $request->validated());

        return back()->with('success', 'Reseña creada.');
    }

    public function update(UpdateAdminReviewRequest $request, Review $review): RedirectResponse
    {
        /** @var User $admin */
        $admin = $request->user();

        $this->reviewService->updateAsAdmin($admin, $review, $request->validated());

        return back()->with('success', 'Reseña actualizada.');
    }

    public function approve(Request $request, Review $review): RedirectResponse
    {
        /** @var User $admin */
        $admin = $request->user();

        $this->reviewService->approveAsAdmin($admin, $review);

        return back()->with('success', 'Reseña aprobada.');
    }

    public function destroy(Request $request, Review $review): RedirectResponse
    {
        /** @var User $admin */
        $admin = $request->user();

        $this->reviewService->deleteAsAdmin($admin, $review);

        return back()->with('success', 'Reseña eliminada.');
    }
}
