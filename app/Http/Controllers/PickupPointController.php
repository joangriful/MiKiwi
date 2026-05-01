<?php

namespace App\Http\Controllers;

use App\Domain\Shipping\Services\PickupPointService;
use Illuminate\Http\Request;

class PickupPointController extends Controller
{
    public function __construct(
        private readonly PickupPointService $pickupPointService,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = [];
        if ($request->filled('city')) {
            $filters['poblacion'] = $request->string('city')->toString();
        }
        if ($request->filled('postal_code')) {
            $filters['codPostal'] = $request->string('postal_code')->toString();
        }

        return response()->json($this->pickupPointService->search($filters));
    }
}
