<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class NewCategorySeeder extends Seeder
{
    public function run(): void
    {
        // Limpiamos las categorías actuales si es necesario, pero mantenemos la integridad
        // Alternativamente, podemos solo añadir las nuevas si ya hay datos reales.
        // Dado que es una reestructuración completa, crearemos estas como las maestras.

        $structure = [
            'Femenino' => [
                'Succión y Aire',
                'Vibradores Internos',
                'Estimulación Externa'
            ],
            'Masculino' => [
                'Masturbadores',
                'Masaje de Próstata',
                'Anillos Vibradores'
            ],
            'Parejas' => [
                'Control a Distancia',
                'Juguetes Compartidos',
                'Accesorios de Juego'
            ],
            'Cosmética' => [
                'Lubricantes Base Agua',
                'Aceites y Velas',
                'Geles Estimulantes'
            ],
            'Sets' => [
                'Kits para Principiantes',
                'Packs de Regalo',
                'Kits de Viaje'
            ],
            'Cuidado' => [
                'Limpieza e Higiene',
                'Cables y Recambios',
                'Fundas y Guardado'
            ]
        ];

        foreach ($structure as $parentName => $children) {
            $parent = Category::updateOrCreate(
                ['slug' => Str::slug($parentName)],
                [
                    'name' => $parentName,
                    'is_active' => true,
                    'parent_id' => null
                ]
            );

            foreach ($children as $childName) {
                Category::updateOrCreate(
                    ['slug' => Str::slug($childName)],
                    [
                        'name' => $childName,
                        'is_active' => true,
                        'parent_id' => $parent->getKey()
                    ]
                );
            }
        }

        $this->command->info('✅ Jerarquía de 6 categorías y subcategorías creada correctamente.');
    }
}
