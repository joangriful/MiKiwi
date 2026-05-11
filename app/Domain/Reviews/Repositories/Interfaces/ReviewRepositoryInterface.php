<?php

declare(strict_types=1);

namespace App\Domain\Reviews\Repositories\Interfaces;

use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

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

    /**
     * @return Collection<int, Review>
     */
    public function getApprovedForProduct(Product $product): Collection;

    /**
     * @return Collection<int, Review>
     */
    public function getPending(): Collection;

    /**
     * @return Collection<int, Review>
     */
    public function getForUser(User $user): Collection;

    /**
     * @return Collection<int, Review>
     */
    public function getForAdmin(): Collection;

    public function userHasReviewedProduct(User $user, Product $product): bool;

    public function getUserReviewForProduct(User $user, Product $product): ?Review;

    public function userHasPurchasedProduct(User $user, Product $product): bool;
}
