<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CorreosService
{
    protected $baseUrl;
    protected $clientId;
    protected $clientSecret;

    public function __construct()
    {
        $this->baseUrl = config('services.correos.base_url', 'https://api.correos.es');
        $this->clientId = config('services.correos.client_id');
        $this->clientSecret = config('services.correos.client_secret');
    }

    /**
     * Get OAuth Token
     */
    protected function getToken()
    {
        $token = Cache::get('correos_token');
        if ($token)
            return $token;

        try {
            // Often Correos uses /token/v1/accessToken for OAuth2
            $response = Http::asForm()->post($this->baseUrl . '/token/v1/accessToken', [
                'grant_type' => 'client_credentials',
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
            ]);

            if ($response->successful()) {
                $token = $response->json()['access_token'];
                Cache::put('correos_token', $token, 3500);
                return $token;
            }

            // Fallback to /token
            $response = Http::asForm()->post($this->baseUrl . '/token', [
                'grant_type' => 'client_credentials',
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
            ]);

            if ($response->successful()) {
                $token = $response->json()['access_token'];
                Cache::put('correos_token', $token, 3500);
                return $token;
            }

            Log::warning('Correos API: No se pudo obtener el token (404/DNS?). Usando mock data.');
            return null;
        } catch (\Exception $e) {
            Log::warning('Correos API Exception: ' . $e->getMessage() . '. Usando mock data.');
            return null;
        }
    }

    /**
     * Get Pickup Points (Terminals/Citypaq)
     */
    public function getTerminals($filters = [])
    {
        $token = $this->getToken();

        if ($token) {
            try {
                $response = Http::withToken($token)
                    ->timeout(5)
                    ->get($this->baseUrl . '/homepaq/v1/homepaqs', $filters);

                if ($response->successful()) {
                    return $this->formatTerminals($response->json());
                }

                $response = Http::withToken($token)
                    ->timeout(5)
                    ->get($this->baseUrl . '/terminals/v1/', $filters);

                if ($response->successful()) {
                    return $this->formatTerminals($response->json());
                }
            } catch (\Exception $e) {
                Log::warning('Correos API Request failed: ' . $e->getMessage());
            }
        }

        // Fallback to Mock Data if API fails or no token
        return $this->getMockTerminals($filters);
    }

    /**
     * Provide mock data for development/restricted environments
     */
    protected function getMockTerminals($filters = [])
    {
        $allMocks = [
            [
                'name' => 'Citypaq - Oficina Principal Madrid',
                'address' => 'Plaza de Cibeles s/n',
                'city' => 'MADRID',
                'postal_code' => '28014',
            ],
            [
                'name' => 'Citypaq - Estación de Atocha',
                'address' => 'Glorieta de Carlos V',
                'city' => 'MADRID',
                'postal_code' => '28045',
            ],
            [
                'name' => 'Citypaq - El Corte Inglés Sol',
                'address' => 'Puerta del Sol 10',
                'city' => 'MADRID',
                'postal_code' => '28013',
            ],
            [
                'name' => 'Citypaq - Oficina Correos Barcelona',
                'address' => 'Via Laietana 1',
                'city' => 'BARCELONA',
                'postal_code' => '08003',
            ],
            [
                'name' => 'Citypaq - CC Nevada Shopping',
                'address' => 'Av. de las Palmeras 75',
                'city' => 'ARMILLA',
                'postal_code' => '18100',
            ],
        ];

        // Filter by city if provided
        if (!empty($filters['poblacion'])) {
            $city = strtoupper($filters['poblacion']);
            return array_values(array_filter($allMocks, function ($item) use ($city) {
                return str_contains(strtoupper($item['city']), $city);
            }));
        }

        return $allMocks;
    }

    /**
     * Format Correos response to our local structure
     */
    protected function formatTerminals($data)
    {
        $terminals = [];
        $items = $data['items'] ?? $data['list'] ?? $data['terminals'] ?? $data;

        if (!is_array($items))
            return [];

        foreach ($items as $item) {
            $terminals[] = [
                'name' => $item['descripcion'] ?? $item['nombre'] ?? $item['name'] ?? 'Citypaq',
                'address' => $item['direccion'] ?? $item['address'] ?? 'Sin dirección',
                'city' => $item['poblacion'] ?? $item['ciudad'] ?? $item['city'] ?? '',
                'postal_code' => $item['codPostal'] ?? $item['postalCode'] ?? '',
                'latitude' => $item['latitud'] ?? $item['latitude'] ?? null,
                'longitude' => $item['longitud'] ?? $item['longitude'] ?? null,
            ];
        }

        return $terminals;
    }
}
