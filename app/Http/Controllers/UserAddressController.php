<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAddressRequest;
use App\Http\Requests\UpdateAddressRequest;
use App\Models\UserAddress;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

    public function store(StoreAddressRequest $request)
    {
        $data = $request->validated();

        DB::transaction(function () use ($data): void {
            if (! empty($data['is_default'])) {
                UserAddress::where('user_id', Auth::id())
                    ->update(['is_default' => false]);
            }

            auth()->user()->addresses()->create($data);
        });

        return back()->with('success', 'Dirección guardada correctamente');
    }

    public function update(UpdateAddressRequest $request, UserAddress $address)
    {
        $this->authorize('update', $address);

        $data = $request->validated();

        DB::transaction(function () use ($address, $data): void {
            if (! empty($data['is_default'])) {
                UserAddress::where('user_id', Auth::id())
                    ->where('id', '!=', $address->getKey())
                    ->update(['is_default' => false]);
            }

            $address->update($data);
        });

        return back()->with('success', 'Dirección actualizada');
    }

    public function destroy(UserAddress $address)
    {
        $this->authorize('delete', $address);

        $address->delete();

        return response()->json(['message' => 'Dirección eliminada']);
    }
}
