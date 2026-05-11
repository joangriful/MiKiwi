<?php

declare(strict_types=1);

namespace App\Domain\Reviews\Repositories\Eloquent;

use App\Domain\Reviews\Repositories\Interfaces\ReviewRepositoryInterface;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;

class EloquentReviewRepository implements ReviewRepositoryInterface
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Review
    {
        return Review::query()->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Review $review, array $data): Review
    {
        $review->update($data);

        return $review->refresh();
    }

    public function delete(Review $review): bool
    {
        return (bool) $review->delete();
    }

    public function userHasReviewedProduct(User $user, Product $product): bool
    {
        return Review::query()
            ->where('user_id', $user->getKey())
            ->where('product_id', $product->getKey())
            ->exists();
    }

    public function userHasPurchasedProduct(User $user, Product $product): bool
    {
        return Order::query()
            ->where('user_id', $user->getKey())
            ->where('payment_status', PaymentStatus::Paid->value)
            ->where('status', '!=', OrderStatus::Cancelled->value)
            ->whereHas('items', fn ($query) => $query->where('product_id', $product->getKey()))
            ->exists();
    }
}
