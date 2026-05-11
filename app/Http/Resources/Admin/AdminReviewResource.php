<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminReviewResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'is_approved' => $this->is_approved,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'user' => $this->whenLoaded('user', fn (): array => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'email' => $this->user?->email,
            ]),
            'product' => $this->whenLoaded('product', fn (): array => [
                'id' => $this->product?->id,
                'name' => $this->product?->name,
                'slug' => $this->product?->slug,
                'sku' => $this->product?->sku,
            ]),
        ];
    }
}
