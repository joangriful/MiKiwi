<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreCartRequest extends FormRequest
{
    /**
     * Determina si el usuario está autorizado
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Reglas de validación para agregar al carrito
     */
    public function rules(): array
    {
        return [
            'product_slug' => 'required|string|exists:products,slug',
            'quantity' => 'required|integer|min:1|max:99',
            'accessories' => 'nullable|array',
            'accessories.*' => 'string|exists:products,slug',
        ];
    }

    /**
     * Mensajes de error en español
     */
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
        ];
    }

    /**
     * Atributos personalizados
     */
    public function attributes(): array
    {
        return [
            'product_slug' => 'producto',
            'quantity' => 'cantidad',
            'accessories' => 'accesorios',
        ];
    }
}
