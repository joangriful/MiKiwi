<?php

namespace Database\Seeders;

use App\Models\PickupPoint;
use Illuminate\Database\Seeder;

class PickupPointSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $points = [
            [
                'name' => 'Tienda MiKiwi Centro',
                'address' => 'Calle Mayor, 1',
                'city' => 'Madrid',
                'postal_code' => '28013',
            ],
            [
                'name' => 'MiKiwi Barcelona Eixample',
                'address' => 'Carrer de Balmes, 100',
                'city' => 'Barcelona',
                'postal_code' => '08008',
            ],
            [
                'name' => 'Punto Pack MiKiwi Valencia',
                'address' => 'Avenida del Cid, 50',
                'city' => 'Valencia',
                'postal_code' => '46014',
            ],
            [
                'name' => 'MiKiwi Sevilla Triana',
                'address' => 'Calle San Jacinto, 10',
                'city' => 'Sevilla',
                'postal_code' => '41010',
            ],
            [
                'name' => 'Tienda MiKiwi Bilbao',
                'address' => 'Gran Vía de Don Diego López de Haro, 20',
                'city' => 'Bilbao',
                'postal_code' => '48001',
            ],
        ];

        foreach ($points as $point) {
            PickupPoint::updateOrCreate(
                [
                    'name' => $point['name'],
                    'postal_code' => $point['postal_code'],
                ],
                $point + ['is_active' => true]
            );
        }
    }
}
