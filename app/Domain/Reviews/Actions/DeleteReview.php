<?php

declare(strict_types=1);

namespace App\Domain\Reviews\Actions;

use App\Domain\Reviews\Repositories\Interfaces\ReviewRepositoryInterface;
use App\Models\Review;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;

class DeleteReview
{
    public function __construct(
        private readonly ReviewRepositoryInterface $reviewRepository,
    ) {}

    /**
     * @throws AuthorizationException
     */
    public function execute(User $admin, Review $review): bool
    {
        if ($admin->cannot('delete', $review)) {
            throw new AuthorizationException('Solo los administradores pueden eliminar reseñas.');
        }

        return $this->reviewRepository->delete($review);
    }
}
