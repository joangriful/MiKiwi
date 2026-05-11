<?php

declare(strict_types=1);

namespace App\Domain\Reviews\Actions;

use App\Domain\Reviews\Repositories\Interfaces\ReviewRepositoryInterface;
use App\Models\Review;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;

class UpdateReview
{
    public function __construct(
        private readonly ReviewRepositoryInterface $reviewRepository,
    ) {}

    /**
     * @param  array{rating?:int, comment?:string|null, is_approved?:bool}  $data
     *
     * @throws AuthorizationException
     */
    public function execute(User $admin, Review $review, array $data): Review
    {
        if ($admin->cannot('update', $review)) {
            throw new AuthorizationException('Solo los administradores pueden editar reseñas.');
        }

        return $this->reviewRepository->update($review, $data);
    }
}
