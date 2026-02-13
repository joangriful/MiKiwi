<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateAddressRequest extends FormRequest
{
    /**
     * Determina si el usuario está autorizado
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Reglas de validación para actualizar dirección
     */
    public function rules(): array
    {
        return [
            'alias' => 'nullable|string|max:50',
            'full_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:30',
            'street_address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'is_default' => 'boolean',
        ];
    }

    /**
     * Mensajes de error personalizados en español
     */
    public function messages(): array
    {
        return [
            'full_name.required' => 'El nombre completo es obligatorio.',
            'full_name.max' => 'El nombre no puede tener más de :max caracteres.',
            'street_address.required' => 'La dirección es obligatoria.',
            'street_address.max' => 'La dirección no puede tener más de :max caracteres.',
            'city.required' => 'La ciudad es obligatoria.',
            'city.max' => 'La ciudad no puede tener más de :max caracteres.',
            'postal_code.required' => 'El código postal es obligatorio.',
            'postal_code.max' => 'El código postal no puede tener más de :max caracteres.',
            'country.required' => 'El país es obligatorio.',
            'country.max' => 'El país no puede tener más de :max caracteres.',
            'alias.max' => 'El alias no puede tener más de :max caracteres.',
            'phone.max' => 'El teléfono no puede tener más de :max caracteres.',
            'is_default.boolean' => 'El valor debe ser verdadero o falso.',
        ];
    }

    /**
     * Atributos personalizados para mensajes
     */
    public function attributes(): array
    {
        return [
            'full_name' => 'nombre completo',
            'street_address' => 'dirección',
            'postal_code' => 'código postal',
            'is_default' => 'dirección predeterminada',
        ];
    }
}
