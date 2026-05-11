<?php

declare(strict_types=1);

namespace App\Domain\Reviews\Actions;

use App\Domain\Reviews\Repositories\Interfaces\ReviewRepositoryInterface;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Validation\ValidationException;

class CreateReview
{
    public function __construct(
        private readonly ReviewRepositoryInterface $reviewRepository,
    ) {}

    /**
     * @param  array{rating:int, comment?:string|null}  $data
     *
     * @throws AuthorizationException
     * @throws ValidationException
     */
    public function execute(User $user, Product $product, array $data): Review
    {
        if (! $this->reviewRepository->userHasPurchasedProduct($user, $product)) {
            throw new AuthorizationException('Solo puedes reseñar productos comprados.');
        }

        if ($this->reviewRepository->userHasReviewedProduct($user, $product)) {
            throw ValidationException::withMessages([
                'product' => 'Ya has creado una reseña para este producto.',
            ]);
        }

        return $this->reviewRepository->create([
            'user_id' => $user->getKey(),
            'product_id' => $product->getKey(),
            'rating' => $data['rating'],
            'comment' => $data['comment'] ?? null,
            'is_approved' => false,
        ]);
    }
}
