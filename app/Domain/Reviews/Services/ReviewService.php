<?php

declare(strict_types=1);

namespace App\Domain\Reviews\Services;

use App\Domain\Reviews\Actions\CreateReview;
use App\Domain\Reviews\Repositories\Interfaces\ReviewRepositoryInterface;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;

class ReviewService
{
    public function __construct(
        private readonly CreateReview $createReview,
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
        $this->authorizeAdmin($admin, 'update', $review);

        return $this->reviewRepository->update($review, $data);
    }

    public function approveAsAdmin(User $admin, Review $review): Review
    {
        $this->authorizeAdmin($admin, 'approve', $review);

        return $this->reviewRepository->update($review, [
            'is_approved' => true,
        ]);
    }

    public function deleteAsAdmin(User $admin, Review $review): bool
    {
        $this->authorizeAdmin($admin, 'delete', $review);

        return $this->reviewRepository->delete($review);
    }

    private function authorizeAdmin(User $user, string $ability, Review $review): void
    {
        if ($user->cannot($ability, $review)) {
            throw new AuthorizationException('Solo los administradores pueden gestionar reseñas.');
        }
    }
}
