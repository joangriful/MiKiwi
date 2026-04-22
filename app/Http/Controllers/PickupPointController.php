<?php

namespace App\Http\Controllers;

use App\Domain\Shipping\Services\CorreosService;
use App\Models\PickupPoint;
use App\Support\Database\CaseInsensitiveSearch;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class PickupPointController extends Controller
{
    protected $correosService;

    public function __construct(CorreosService $correosService)
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

        if ($this->correosService->hasCredentials()) {
            $externalTerminals = $this->correosService->getRealTerminals($filters);

            if (! empty($externalTerminals)) {
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
        $query = PickupPoint::query()->where('is_active', true);

        if ($request->filled('city')) {
            CaseInsensitiveSearch::contains($query, 'city', $request->string('city')->toString());
        }

        if ($request->filled('postal_code')) {
            $cp = $request->postal_code;
            $prefix = substr($cp, 0, 2);
            $query->where(function (Builder $q) use ($cp, $prefix) {
                $q->where('postal_code', $cp)
                    ->orWhere(function (Builder $query) use ($prefix) {
                        return CaseInsensitiveSearch::startsWith($query, 'postal_code', $prefix);
                    });
            });
        }

        $dbResults = $query->get();

        if ($dbResults->isNotEmpty()) {
            return response()->json($dbResults);
        }

        if (! $this->correosService->allowsMockFallback()) {
            return response()->json([]);
        }

        $mocks = $this->correosService->getMockTerminals($filters);

        return response()->json($mocks);
    }
}
