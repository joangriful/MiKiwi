<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Product $product */
        $product = $this->resource;
        $images = $product->images->sortBy('sort_order');

        $firstImage = $images->first();
        $hoverImage = $images->skip(1)->first();

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'sku' => $product->sku,
            'description' => $product->description,
            'base_price' => $product->base_price,
            'is_in_stock' => $this->isInStock($product),
            'image_url' => $firstImage?->image_url,
            'hover_image_url' => $hoverImage?->image_url,
            'images' => $images
                ->map(fn (ProductImage $image): array => [
                    'id' => $image->id,
                    'url' => $image->image_url,
                    'alt' => $image->alt_text,
                    'sort_order' => $image->sort_order,
                ])
                ->values()
                ->all(),
            'product_type' => $product->product_type,
            'is_promoted' => (bool) $product->is_promoted,
            'is_favorite' => $this->isFavoriteForRequestUser($request, $product),
            'reviews_count' => $this->reviewsCount($product),
            'reviews_average_rating' => $this->reviewsAverageRating($product),
            'can_review' => (bool) $product->getAttribute('can_review'),
            'user_review' => $this->userReview($request, $product),
            'category' => $this->whenLoaded('category', function () use ($product): array {
                return [
                    'id' => $product->category?->id,
                    'name' => $product->category?->name,
                    'slug' => $product->category?->slug,
                ];
            }),
            'reviews' => $this->whenLoaded('reviews', fn () => ReviewResource::collection($product->reviews)->resolve($request)),
        ];
    }

    private function isFavoriteForRequestUser(Request $request, Product $product): bool
    {
        /** @var \App\Models\User|null $user */
        $user = $request->user();

        if (! $user) {
            return false;
        }

        if (array_key_exists('is_favorite', $product->getAttributes())) {
            return (bool) $product->getAttribute('is_favorite');
        }

        return $product->favoritedByUsers()
            ->whereKey($user->getKey())
            ->exists();
    }

    private function isInStock(Product $product): bool
    {
        if (! array_key_exists('stock_quantity', $product->getAttributes())) {
            return true;
        }

        return (int) $product->stock_quantity > 0;
    }

    private function reviewsCount(Product $product): int
    {
        if (array_key_exists('reviews_count', $product->getAttributes())) {
            return (int) $product->getAttribute('reviews_count');
        }

        if ($product->relationLoaded('reviews')) {
            return $product->reviews->count();
        }

        return 0;
    }

    private function reviewsAverageRating(Product $product): ?float
    {
        if (array_key_exists('reviews_average_rating', $product->getAttributes())) {
            $average = $product->getAttribute('reviews_average_rating');

            return $average === null ? null : round((float) $average, 2);
        }

        if ($product->relationLoaded('reviews') && $product->reviews->isNotEmpty()) {
            return round((float) $product->reviews->avg('rating'), 2);
        }

        return null;
    }

    private function userReview(Request $request, Product $product): ?array
    {
        if (! $product->relationLoaded('userReview')) {
            return null;
        }

        $review = $product->getRelation('userReview');

        if (! $review instanceof Review) {
            return null;
        }

        return ReviewResource::make($review)->resolve($request);
    }
}
