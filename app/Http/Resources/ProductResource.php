<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Product;
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

        return [
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'base_price' => $product->base_price,
            'image_url' => $product->image_url,
            'hover_image_url' => $product->hover_image_url,
            'images' => $product->images,
            'product_type' => $product->product_type,
            'category' => $this->whenLoaded('category', function () use ($product): array {
                return [
                    'name' => $product->category?->name,
                    'slug' => $product->category?->slug,
                ];
            }),
            'reviews' => $this->whenLoaded('reviews', fn () => ReviewResource::collection($product->reviews)->resolve($request)),
        ];
    }
}
