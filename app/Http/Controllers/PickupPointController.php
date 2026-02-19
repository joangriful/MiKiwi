<?php

namespace App\Http\Controllers;

use App\Models\PickupPoint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

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
        $city = (string) $request->query('city', '');
        $postalCode = (string) $request->query('postal_code', '');
        $cacheKey = 'pickup_points_index_'.md5($city.'|'.$postalCode);
        $cacheTtl = (int) config('services.correos.pickup_cache_ttl', 300);

        return Cache::remember($cacheKey, $cacheTtl, function () use ($city, $postalCode) {
            // Try to get real-time terminals if service is configured
            if (config('services.correos.client_id')) {
                $filters = [];
                if ($city !== '') {
                    $filters['poblacion'] = $city;
                }
                if ($postalCode !== '') {
                    $filters['codPostal'] = $postalCode;
                }

                $externalTerminals = $this->correosService->getTerminals($filters);

                if (! empty($externalTerminals)) {
                    $syncPoints = [];
                    foreach (array_slice($externalTerminals, 0, 50) as $ext) {
                        // Sync with local DB to ensure we have a valid local ID for the order
                        $localPoint = PickupPoint::updateOrCreate(
                            ['address' => $ext['address'], 'postal_code' => $ext['postal_code']],
                            [
                                'name' => $ext['name'],
                                'city' => $ext['city'],
                                'is_active' => true,
                            ]
                        );
                        $syncPoints[] = $localPoint;
                    }

                    return response()->json($syncPoints);
                }
            }

            // Fallback to local database if no credentials or no results
            $query = PickupPoint::where('is_active', true);

            if ($city !== '') {
                $query->where('city', 'like', '%'.$city.'%');
            }

            if ($postalCode !== '') {
                $query->where('postal_code', 'like', '%'.$postalCode.'%');
            }

            return response()->json(
                $query
                    ->select(['id', 'name', 'address', 'city', 'postal_code'])
                    ->orderBy('name')
                    ->limit(50)
                    ->get()
            );
        });
    }
}
