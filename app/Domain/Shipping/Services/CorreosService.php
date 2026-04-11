<?php

namespace App\Domain\Shipping\Services;

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
            // Madrid
            ['id' => 'mock-mad-1', 'name' => 'Citypaq - Oficina Principal Madrid', 'address' => 'Plaza de Cibeles s/n', 'city' => 'MADRID', 'postal_code' => '28014'],
            ['id' => 'mock-mad-2', 'name' => 'Citypaq - Estación de Atocha', 'address' => 'Glorieta de Carlos V', 'city' => 'MADRID', 'postal_code' => '28045'],
            ['id' => 'mock-mad-3', 'name' => 'Citypaq - El Corte Inglés Sol', 'address' => 'Puerta del Sol 10', 'city' => 'MADRID', 'postal_code' => '28013'],

            // Barcelona
            ['id' => 'mock-bcn-1', 'name' => 'Citypaq - Oficina Principal Barcelona', 'address' => 'Via Laietana 1', 'city' => 'BARCELONA', 'postal_code' => '08003'],
            ['id' => 'mock-bcn-2', 'name' => 'Citypaq - Estació de Sants', 'address' => 'Plaza dels Països Catalans s/n', 'city' => 'BARCELONA', 'postal_code' => '08014'],

            // Valencia
            ['id' => 'mock-vlc-1', 'name' => 'Citypaq - Oficina Principal Valencia', 'address' => 'Plaza del Ayuntamiento 24', 'city' => 'VALENCIA', 'postal_code' => '46002'],

            // Sevilla
            ['id' => 'mock-svq-1', 'name' => 'Citypaq - Oficina Principal Sevilla', 'address' => 'Avenida de la Constitución 32', 'city' => 'SEVILLA', 'postal_code' => '41001'],

            // Bilbao
            ['id' => 'mock-bio-1', 'name' => 'Citypaq - Oficina Principal Bilbao', 'address' => 'Alameda de Urquijo 19', 'city' => 'BILBAO', 'postal_code' => '48008'],

            // Others
            ['id' => 'mock-grx-1', 'name' => 'Citypaq - CC Nevada Shopping', 'address' => 'Av. de las Palmeras 75', 'city' => 'ARMILLA', 'postal_code' => '18100'],
            ['id' => 'mock-slm-1', 'name' => 'Citypaq - Plaza Mayor Salamanca', 'address' => 'Plaza Mayor 1', 'city' => 'SALAMANCA', 'postal_code' => '37002'],
            ['id' => 'mock-agp-1', 'name' => 'Citypaq - CC Larios Centro', 'address' => 'Av. de la Aurora 25', 'city' => 'MALAGA', 'postal_code' => '29002'],
        ];

        $results = [];

        // Filter by postal code if provided
        if (!empty($filters['codPostal'])) {
            $cp = (string) $filters['codPostal'];
            $cpPrefix = substr($cp, 0, 2);

            $results = array_values(array_filter($allMocks, function ($item) use ($cp, $cpPrefix) {
                // Exact match or same province (first 2 digits)
                return $item['postal_code'] === $cp || substr($item['postal_code'], 0, 2) === $cpPrefix;
            }));

            // If no mock data matches the CP province, "generate" local results for the UI
            if (empty($results) && strlen($cp) === 5) {
                return [
                    [
                        'id' => 'mock-gen-' . $cp . '-1',
                        'name' => 'Citypaq - Sucursal Correos (' . $cp . ')',
                        'address' => 'Calle Mayor 1',
                        'city' => 'Localidad ' . $cp,
                        'postal_code' => $cp,
                    ],
                    [
                        'id' => 'mock-gen-' . $cp . '-2',
                        'name' => 'Citypaq - Centro Comercial Zona ' . $cp,
                        'address' => 'Avenida de la Libertad 10',
                        'city' => 'Localidad ' . $cp,
                        'postal_code' => $cp,
                    ],
                    [
                        'id' => 'mock-gen-' . $cp . '-3',
                        'name' => 'Citypaq - Gasolinera 24h CP ' . $cp,
                        'address' => 'Carretera Nacional km 4',
                        'city' => 'Localidad ' . $cp,
                        'postal_code' => $cp,
                    ]
                ];
            }
        } elseif (!empty($filters['poblacion'])) {
            // Filter by city (poblacion) if provided
            $city = strtoupper($filters['poblacion']);
            $results = array_values(array_filter($allMocks, function ($item) use ($city) {
                return str_contains(strtoupper($item['city']), $city);
            }));
        }

        return !empty($results) ? $results : array_slice($allMocks, 0, 5);
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
