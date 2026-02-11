<?php

namespace App\Http\Controllers;

use App\Models\UserAddress;
use App\Http\Requests\StoreAddressRequest; // ¡Importante!
use App\Http\Requests\UpdateAddressRequest; // ¡Importante!
use Illuminate\Http\Request;

class UserAddressController extends Controller
{
    public function index()
    {
        return auth()->user()->addresses;
    }

    // Inyectamos StoreAddressRequest
    public function store(StoreAddressRequest $request)
    {
        // $request->validated() devuelve solo los datos limpios y seguros
        $address = auth()->user()->addresses()->create($request->validated());

        return response()->json($address, 201);
    }

    // Inyectamos UpdateAddressRequest
    public function update(UpdateAddressRequest $request, UserAddress $address)
    {
        // Autorización (Policy creada en Etapa 2)
        $this->authorize('update', $address);

        $address->update($request->validated());

        return response()->json($address);
    }

    // Eliminar dirección
    public function destroy(UserAddress $address)
    {
        // Autorización (Policy creada en Etapa 2)
        $this->authorize('delete', $address);

        $address->delete();

        return response()->json(['message' => 'Dirección eliminada']);
    }
}
