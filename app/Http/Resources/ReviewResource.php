<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'rating' => $this->rating,
            'comment' => $this->comment,
            'created_at' => $this->created_at?->toISOString(),
            'user_name' => $this->whenLoaded('user', fn () => $this->user?->name),
        ];
    }
}
