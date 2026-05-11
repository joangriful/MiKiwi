<?php

declare(strict_types=1);

namespace App\Domain\Reviews\Repositories\Interfaces;

use App\Models\Product;
use App\Models\Review;
use App\Models\User;

interface ReviewRepositoryInterface
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Review;

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Review $review, array $data): Review;

    public function delete(Review $review): bool;

    public function userHasReviewedProduct(User $user, Product $product): bool;

    public function userHasPurchasedProduct(User $user, Product $product): bool;
}
