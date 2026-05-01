<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ApplyCouponRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'El código del cupón es obligatorio.',
            'code.string' => 'El código del cupón no es válido.',
        ];
    }
}
