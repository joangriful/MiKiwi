<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Product;
use App\Models\ProductImage;
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
            'stock_quantity' => $product->stock_quantity,
            'is_in_stock' => $product->stock_quantity > 0,
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
}
