<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CollectionCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        $collections = [
            [
                'slug' => 'para-ella',
                'name' => 'Para Ella',
                'description' => 'Productos diseñados especialmente para la estimulación femenina',
            ],
            [
                'slug' => 'para-el',
                'name' => 'Para Él',
                'description' => 'Productos diseñados especialmente para la estimulación masculina',
            ],
            [
                'slug' => 'parejas',
                'name' => 'Parejas',
                'description' => 'Productos para disfrutar en pareja',
            ],
            [
                'slug' => 'experiencias',
                'name' => 'Experiencias',
                'description' => 'Productos para exploración BDSM y experiencias avanzadas',
            ],
        ];

        foreach ($collections as $data) {
            Category::updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'name' => $data['name'],
                    'description' => $data['description'],
                    'is_active' => true,
                    'parent_id' => null,
                ]
            );
        }

        $this->command->info('✅ CollectionCategoriesSeeder: 4 colecciones creadas (para-ella, para-el, parejas, experiencias)');
    }
}
