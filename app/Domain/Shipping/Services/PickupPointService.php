<?php

declare(strict_types=1);

namespace App\Domain\Shipping\Services;

use App\Models\PickupPoint;
use App\Support\Database\CaseInsensitiveSearch;
use Illuminate\Database\Eloquent\Builder;

class PickupPointService
{
    public function __construct(
        private readonly CorreosService $correosService,
    ) {}

    public function search(array $filters): array
    {
        if ($this->correosService->hasCredentials()) {
            $externalTerminals = $this->correosService->getRealTerminals($filters);

            if (! empty($externalTerminals)) {
                foreach ($externalTerminals as $terminal) {
                    PickupPoint::query()->updateOrCreate(
                        ['address' => $terminal['address'], 'postal_code' => $terminal['postal_code']],
                        ['name' => $terminal['name'], 'city' => $terminal['city'], 'is_active' => true]
                    );
                }

                return $externalTerminals;
            }
        }

        $localResults = $this->searchLocal($filters);

        if ($localResults !== []) {
            return $localResults;
        }

        if (! $this->correosService->allowsMockFallback()) {
            return [];
        }

        return $this->correosService->getMockTerminals($filters);
    }

    private function searchLocal(array $filters): array
    {
        $query = PickupPoint::query()->where('is_active', true);

        if (! empty($filters['poblacion'])) {
            CaseInsensitiveSearch::contains($query, 'city', (string) $filters['poblacion']);
        }

        if (! empty($filters['codPostal'])) {
            $postalCode = (string) $filters['codPostal'];
            $prefix = substr($postalCode, 0, 2);

            $query->where(function (Builder $builder) use ($postalCode, $prefix): void {
                $builder->where('postal_code', $postalCode)
                    ->orWhere(function (Builder $nested) use ($prefix): void {
                        CaseInsensitiveSearch::startsWith($nested, 'postal_code', $prefix);
                    });
            });
        }

        return $query->get()->all();
    }
}
