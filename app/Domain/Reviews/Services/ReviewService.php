<?php

declare(strict_types=1);

namespace App\Domain\Reviews\Services;

use App\Domain\Reviews\Actions\ApproveReview;
use App\Domain\Reviews\Actions\CreateReview;
use App\Domain\Reviews\Actions\DeleteReview;
use App\Domain\Reviews\Actions\UpdateReview;
use App\Domain\Reviews\Repositories\Interfaces\ReviewRepositoryInterface;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

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
}
