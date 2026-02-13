<?php

namespace App\Http\Controllers;

use App\Models\PickupPoint;
use Illuminate\Http\Request;

class PickupPointController extends Controller
{
    protected $correosService;

    public function __construct(\App\Services\CorreosService $correosService)
    {
        $this->correosService = $correosService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Try to get real-time terminals if service is configured
        if (config('services.correos.client_id')) {
            $filters = [];
            if ($request->has('city'))
                $filters['poblacion'] = $request->city;
            if ($request->has('postal_code'))
                $filters['codPostal'] = $request->postal_code;

            $externalTerminals = $this->correosService->getTerminals($filters);

            if (!empty($externalTerminals)) {
                $syncPoints = [];
                foreach ($externalTerminals as $ext) {
                    // Sync with local DB to ensure we have a valid local ID for the order
                    $localPoint = PickupPoint::updateOrCreate(
                        ['address' => $ext['address'], 'postal_code' => $ext['postal_code']],
                        [
                            'name' => $ext['name'],
                            'city' => $ext['city'],
                            'is_active' => true
                        ]
                    );
                    $syncPoints[] = $localPoint;
                }
                return response()->json($syncPoints);
            }
        }

        // Fallback to local database if no credentials or no results
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
