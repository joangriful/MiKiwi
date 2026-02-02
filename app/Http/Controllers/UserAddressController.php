<?php

namespace App\Http\Controllers;

use App\Models\UserAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class UserAddressController extends Controller
{
    // Listar direcciones del usuario
    public function index()
    {
        $addresses = UserAddress::where('user_id', Auth::id())
            ->orderByDesc('is_default')
            ->get();

        return Inertia::render('Profile/Addresses/Index', [
            'addresses' => $addresses
        ]);
    }

    // Guardar nueva dirección
    public function store(Request $request)
    {
        $data = $request->validate([
            'alias' => 'nullable|string|max:50',
            'full_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:30',
            'street_address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'is_default' => 'boolean',
        ]);

        // Si es principal, desmarcar las demás
        if (!empty($data['is_default'])) {
            UserAddress::where('user_id', Auth::id())
                ->update(['is_default' => false]);
        }

        UserAddress::create([
            'user_id' => Auth::id(),
            ...$data,
        ]);

        return back()->with('success', 'Dirección guardada correctamente');
    }

    // Actualizar dirección
    public function update(Request $request, UserAddress $address)
    {
        $this->authorizeAddress($address);

        $data = $request->validate([
            'alias' => 'nullable|string|max:50',
            'full_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:30',
            'street_address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'is_default' => 'boolean',
        ]);

        if (!empty($data['is_default'])) {
            UserAddress::where('user_id', Auth::id())
                ->update(['is_default' => false]);
        }

        $address->update($data);

        return back()->with('success', 'Dirección actualizada');
    }

    // Eliminar dirección
    public function destroy(UserAddress $address)
    {
        $this->authorizeAddress($address);

        $address->delete();

        return back()->with('success', 'Dirección eliminada');
    }

    // 🔐 Asegurarse de que la dirección es del usuario
    private function authorizeAddress(UserAddress $address)
    {
        abort_if($address->user_id !== Auth::id(), 403);
    }
}
