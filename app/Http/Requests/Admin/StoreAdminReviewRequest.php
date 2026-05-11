<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Models\Review;
use Illuminate\Foundation\Http\FormRequest;

class StoreAdminReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('viewAny', Review::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'user_id' => ['required', 'uuid', 'exists:users,id'],
            'product_id' => ['required', 'uuid', 'exists:product,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:2000'],
            'is_approved' => ['sometimes', 'boolean'],
        ];
    }
}
