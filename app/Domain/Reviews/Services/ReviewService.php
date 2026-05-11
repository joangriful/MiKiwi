<?php

declare(strict_types=1);

namespace App\Domain\Reviews\Services;

use App\Domain\Reviews\Actions\ApproveReview;
use App\Domain\Reviews\Actions\CreateReview;
use App\Domain\Reviews\Actions\DeleteReview;
use App\Domain\Reviews\Actions\UpdateReview;
use App\Domain\Reviews\Repositories\Interfaces\ReviewRepositoryInterface;
use App\Http\Resources\AdminReviewResource;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class ReviewService
{
    public function __construct(
        private readonly CreateReview $createReview,
        private readonly UpdateReview $updateReview,
        private readonly ApproveReview $approveReview,
        private readonly DeleteReview $deleteReview,
        private readonly ReviewRepositoryInterface $reviewRepository,
    ) {}

    /**
     * @param  array{rating:int, comment?:string|null}  $data
     */
    public function createUserReview(User $user, Product $product, array $data): Review
    {
        return $this->createReview->execute($user, $product, $data);
    }

    /**
     * @param  array{user_id:string, product_id:string, rating:int, comment?:string|null, is_approved?:bool}  $data
     */
    public function createAsAdmin(User $admin, array $data): Review
    {
        if ($admin->cannot('viewAny', Review::class)) {
            throw new \Illuminate\Auth\Access\AuthorizationException('Solo los administradores pueden crear reseñas.');
        }

        return $this->reviewRepository->create([
            'user_id' => $data['user_id'],
            'product_id' => $data['product_id'],
            'rating' => $data['rating'],
            'comment' => $data['comment'] ?? null,
            'is_approved' => $data['is_approved'] ?? false,
        ]);
    }

    /**
     * @param  array{rating?:int, comment?:string|null, is_approved?:bool}  $data
     */
    public function updateAsAdmin(User $admin, Review $review, array $data): Review
    {
        return $this->updateReview->execute($admin, $review, $data);
    }

    public function approveAsAdmin(User $admin, Review $review): Review
    {
        return $this->approveReview->execute($admin, $review);
    }

    public function deleteAsAdmin(User $admin, Review $review): bool
    {
        return $this->deleteReview->execute($admin, $review);
    }

    /**
     * @return Collection<int, Review>
     */
    public function getApprovedProductReviews(Product $product): Collection
    {
        return $this->reviewRepository->getApprovedForProduct($product);
    }

    /**
     * @return Collection<int, Review>
     */
    public function getPendingReviews(): Collection
    {
        return $this->reviewRepository->getPending();
    }

    /**
     * @return Collection<int, Review>
     */
    public function getUserReviews(User $user): Collection
    {
        return $this->reviewRepository->getForUser($user);
    }

    /**
     * @return Collection<int, Review>
     */
    public function getAdminReviews(): Collection
    {
        return $this->reviewRepository->getForAdmin();
    }

    /**
     * @return array<string, mixed>
     */
    public function getAdminManagerData(Request $request): array
    {
        return [
            'reviews' => AdminReviewResource::collection($this->getAdminReviews())->resolve($request),
            'users' => User::query()
                ->select(['id', 'name', 'email'])
                ->orderBy('name')
                ->get(),
            'products' => Product::query()
                ->select(['id', 'name', 'slug', 'sku'])
                ->orderBy('name')
                ->get(),
        ];
    }

    public function canUserReviewProduct(User $user, Product $product): bool
    {
        return $this->reviewRepository->userHasPurchasedProduct($user, $product)
            && ! $this->reviewRepository->userHasReviewedProduct($user, $product);
    }

    public function getUserReviewForProduct(User $user, Product $product): ?Review
    {
        return $this->reviewRepository->getUserReviewForProduct($user, $product);
    }
}
