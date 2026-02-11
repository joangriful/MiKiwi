<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'items' => 'required|array|min:1', // Debe haber al menos 1 item
            'items.*.product_id' => 'required|uuid|exists:products,id', // El producto DEBE existir
            'items.*.quantity' => 'required|integer|min:1', // Cantidad positiva
            'shipping_address_id' => 'required|uuid|exists:user_addresses,id' // Dirección válida 
        ];
    }
}
