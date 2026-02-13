<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreAddressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
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
     * Mensajes de error en español
     */
    public function messages(): array
    {
        return [
            'full_name.required' => 'El nombre completo es obligatorio.',
            'full_name.max' => 'El nombre no puede tener más de :max caracteres.',
            'street_address.required' => 'La dirección es obligatoria.',
            'city.required' => 'La ciudad es obligatoria.',
            'postal_code.required' => 'El código postal es obligatorio.',
            'country.required' => 'El país es obligatorio.',
        ];
    }
}
