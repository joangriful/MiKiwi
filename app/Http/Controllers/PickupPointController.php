<?php

namespace App\Http\Controllers;

use App\Models\PickupPoint;
use Illuminate\Http\Request;

class PickupPointController extends Controller
{
    protected $correosService;

    public function __construct(\App\Domain\Shipping\Services\CorreosService $correosService)
    {
        $this->correosService = $correosService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = [];
        if ($request->filled('city')) {
            $filters['poblacion'] = $request->city;
        }
        if ($request->filled('postal_code')) {
            $filters['codPostal'] = $request->postal_code;
        }

        // Try real Correos API if credentials configured
        if (config('services.correos.client_id')) {
            $externalTerminals = $this->correosService->getTerminals($filters);

            if (!empty($externalTerminals)) {
                foreach ($externalTerminals as $ext) {
                    PickupPoint::updateOrCreate(
                        ['address' => $ext['address'], 'postal_code' => $ext['postal_code']],
                        ['name' => $ext['name'], 'city' => $ext['city'], 'is_active' => true]
                    );
                }
                return response()->json($externalTerminals);
            }
        }

        // Try local DB
        $query = PickupPoint::where('is_active', true);

        if ($request->filled('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        if ($request->filled('postal_code')) {
            $cp = $request->postal_code;
            $prefix = substr($cp, 0, 2);
            $query->where(function ($q) use ($cp, $prefix) {
                $q->where('postal_code', $cp)
                    ->orWhere('postal_code', 'like', $prefix . '%');
            });
        }

        $dbResults = $query->get();

        if ($dbResults->isNotEmpty()) {
            return response()->json($dbResults);
        }

        // Always fallback to mock data so users always see results
        $mocks = $this->correosService->getTerminals($filters);
        return response()->json($mocks);
    }
}
