<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCartRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_slug' => 'required|string|exists:product,slug',
            'quantity' => 'required|integer|min:1|max:99',
            'accessories' => 'nullable|array',
            'accessories.*' => 'string|exists:product,slug',
            'configuration' => 'nullable|array',
            'configuration.selected_parts' => 'nullable|array',
            'configuration.selected_accessories' => 'nullable|array',
            'configuration.entries' => 'nullable|array',
        ];
    }

    public function messages(): array
    {
        return [
            'product_slug.required' => 'El producto es obligatorio.',
            'product_slug.exists' => 'El producto seleccionado no existe.',
            'quantity.required' => 'La cantidad es obligatoria.',
            'quantity.integer' => 'La cantidad debe ser un número entero.',
            'quantity.min' => 'La cantidad mínima es 1.',
            'quantity.max' => 'La cantidad máxima es 99.',
            'accessories.array' => 'Los accesorios deben ser una lista.',
            'accessories.*.exists' => 'Uno de los accesorios seleccionados no existe.',
            'configuration.array' => 'La configuración de la muñeca debe ser válida.',
        ];
    }

    public function attributes(): array
    {
        return [
            'product_slug' => 'producto',
            'quantity' => 'cantidad',
            'accessories' => 'accesorios',
            'configuration' => 'configuración',
        ];
    }
}
