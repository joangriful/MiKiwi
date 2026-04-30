<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class NewCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Femenino',
            'Succión y Aire',
            'Vibradores Internos',
            'Estimulación Externa',
            'Masculino',
            'Masturbadores',
            'Masaje de Próstata',
            'Anillos Vibradores',
            'Parejas',
            'Control a Distancia',
            'Juguetes Compartidos',
            'Accesorios de Juego',
            'Cosmética',
            'Lubricantes Base Agua',
            'Aceites y Velas',
            'Geles Estimulantes',
            'Sets',
            'Kits para Principiantes',
            'Packs de Regalo',
            'Kits de Viaje',
            'Cuidado',
            'Limpieza e Higiene',
            'Cables y Recambios',
            'Fundas y Guardado',
        ];

        foreach ($categories as $categoryName) {
            Category::updateOrCreate(
                ['slug' => Str::slug($categoryName)],
                [
                    'name' => $categoryName,
                    'is_active' => true,
                ]
            );
        }

        $this->command->info('✅ NewCategorySeeder completado: categorías adicionales planas creadas correctamente.');
    }
}
