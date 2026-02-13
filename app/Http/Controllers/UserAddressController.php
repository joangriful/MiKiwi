<?php

namespace App\Http\Controllers;

use App\Models\UserAddress;
use App\Http\Requests\StoreAddressRequest; // ¡Importante!
use App\Http\Requests\UpdateAddressRequest; // ¡Importante!
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserAddressController extends Controller
{
    public function index()
    {
        $addresses = UserAddress::where('user_id', Auth::id())
            ->orderByDesc('is_default')
            ->get();

        return Inertia::render('Profile/Addresses/Index', [
            'addresses' => $addresses,
        ]);
    }

    // Inyectamos StoreAddressRequest
    public function store(StoreAddressRequest $request)
    {
        // $request->validated() devuelve solo los datos limpios y seguros
        $address = auth()->user()->addresses()->create($request->validated());

        // Si es principal, desmarcar las demás
        if (! empty($data['is_default'])) {
            UserAddress::where('user_id', Auth::id())
                ->update(['is_default' => false]);
        }

        UserAddress::create([
            'user_id' => Auth::id(),
            ...$data,
        ]);

        return back()->with('success', 'Dirección guardada correctamente');
    }

    // Inyectamos UpdateAddressRequest
    public function update(UpdateAddressRequest $request, UserAddress $address)
    {
        // Autorización (Policy creada en Etapa 2)
        $this->authorize('update', $address);

        $address->update($request->validated());

        if (! empty($data['is_default'])) {
            UserAddress::where('user_id', Auth::id())
                ->update(['is_default' => false]);
        }

        $address->update($data);

        return back()->with('success', 'Dirección actualizada');
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
