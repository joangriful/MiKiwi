<?php

declare(strict_types=1);

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determina si el usuario está autorizado
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Reglas de validación para login API
     */
    public function rules(): array
    {
        return [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ];
    }

    /**
     * Mensajes de error en español
     */
    public function messages(): array
    {
        return [
            'email.required' => 'El email es obligatorio.',
            'email.email' => 'El email no tiene un formato válido.',
            'password.required' => 'La contraseña es obligatoria.',
        ];
    }

    /**
     * Atributos personalizados
     */
    public function attributes(): array
    {
        return [
            'email' => 'correo electrónico',
            'password' => 'contraseña',
        ];
    }
}
