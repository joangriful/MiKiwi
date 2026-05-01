<?php

namespace App\Http\Controllers;

use App\Domain\Addresses\Services\UserAddressService;
use App\Http\Requests\StoreAddressRequest;
use App\Http\Requests\UpdateAddressRequest;
use App\Models\Address;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserAddressController extends Controller
{
    public function __construct(
        private readonly UserAddressService $userAddressService,
    ) {}

    public function index()
    {
        $addresses = $this->userAddressService->getUserAddresses((string) Auth::id());

        return Inertia::render('Profile/Index', [
            'addresses' => $addresses,
        ]);
    }

    public function store(StoreAddressRequest $request)
    {
        $this->userAddressService->createAddress((string) Auth::id(), $request->validated());

        return back()->with('success', 'Dirección guardada correctamente');
    }

    public function update(UpdateAddressRequest $request, Address $address)
    {
        $this->authorize('update', $address);

        $updated = $this->userAddressService->updateAddress(
            (string) $address->getKey(),
            (string) Auth::id(),
            $request->validated()
        );

        if (! $updated) {
            return back()->withErrors(['error' => 'No se pudo actualizar la dirección.']);
        }

        return back()->with('success', 'Dirección actualizada');
    }

    public function destroy(Address $address)
    {
        $this->authorize('delete', $address);

        $deleted = $this->userAddressService->deleteAddress((string) $address->getKey(), (string) Auth::id());

        if (! $deleted) {
            return response()->json(['message' => 'No se pudo eliminar la dirección'], 422);
        }

        return response()->json(['message' => 'Dirección eliminada']);
    }
}
