<?php

namespace App\Http\Controllers;

use App\Models\PickupPoint;
use Illuminate\Http\Request;

class PickupPointController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = PickupPoint::where('is_active', true);

        if ($request->has('city')) {
            $query->where('city', 'like', '%'.$request->city.'%');
        }

        if ($request->has('postal_code')) {
            $query->where('postal_code', 'like', '%'.$request->postal_code.'%');
        }

        return response()->json($query->get());
    }
}
