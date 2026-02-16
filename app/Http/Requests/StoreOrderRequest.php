<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determina si el usuario está autorizado
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Reglas de validación para crear pedido
     */
    public function rules(): array
    {
        return [
            'shipping_address' => 'required|array',
            'shipping_address.street_address' => 'required|string|max:255',
            'shipping_address.city' => 'required|string|max:100',
            'shipping_address.postal_code' => 'required|string|max:20',
            'shipping_address.country' => 'required|string|max:100',
            'payment_method' => 'required|string|in:stripe,cash,pickup',
            'payment_intent_id' => 'nullable|string',
            'pickup_point_id' => 'nullable|exists:pickup_points,id',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Mensajes de error en español
     */
    public function messages(): array
    {
        return [
            'shipping_address.required' => 'La dirección de envío es obligatoria.',
            'shipping_address.array' => 'El formato de la dirección no es válido.',
            'shipping_address.street_address.required' => 'La calle y número son obligatorios.',
            'shipping_address.city.required' => 'La ciudad es obligatoria.',
            'shipping_address.postal_code.required' => 'El código postal es obligatorio.',
            'shipping_address.country.required' => 'El país es obligatorio.',
            'payment_method.required' => 'El método de pago es obligatorio.',
            'payment_method.in' => 'El método de pago seleccionado no es válido.',
            'pickup_point_id.exists' => 'El punto de recogida seleccionado no existe.',
            'notes.max' => 'Las notas no pueden tener más de :max caracteres.',
        ];
    }

    /**
     * Atributos personalizados
     */
    public function attributes(): array
    {
        return [
            'shipping_address.street_address' => 'dirección',
            'shipping_address.city' => 'ciudad',
            'shipping_address.postal_code' => 'código postal',
            'shipping_address.country' => 'país',
            'payment_method' => 'método de pago',
            'pickup_point_id' => 'punto de recogida',
            'notes' => 'notas',
        ];
    }
}
