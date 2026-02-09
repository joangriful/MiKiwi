<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

/**
 * CategorySeeder - Crea la estructura de categorías del catálogo MiKiwi
 *
 * Este seeder crea categorías reales del negocio con jerarquía padre-hijo.
 * Las categorías son fundamentales para la organización del catálogo.
 */
class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ========================================
        // 1. CATEGORÍAS RAÍZ (Principales)
        // ========================================

        $munecas = Category::create([
            'name' => 'Muñecas Realistas',
            'slug' => 'munecas-realistas',
            'is_active' => true,
            'parent_id' => null,
        ]);

        $juguetes = Category::create([
            'name' => 'Juguetes Íntimos',
            'slug' => 'juguetes-intimos',
            'is_active' => true,
            'parent_id' => null,
        ]);

        $lubricantes = Category::create([
            'name' => 'Lubricantes',
            'slug' => 'lubricantes',
            'is_active' => true,
            'parent_id' => null,
        ]);

        $lenceria = Category::create([
            'name' => 'Lencería',
            'slug' => 'lenceria',
            'is_active' => true,
            'parent_id' => null,
        ]);

        $componentes = Category::create([
            'name' => 'Componentes',
            'slug' => 'componentes',
            'is_active' => true,
            'parent_id' => null,
        ]);

        // ========================================
        // 2. SUBCATEGORÍAS - Muñecas
        // ========================================

        Category::create([
            'name' => 'Muñecas Premium',
            'slug' => 'munecas-premium',
            'is_active' => true,
            'parent_id' => $munecas->id,
        ]);

        Category::create([
            'name' => 'Muñecas Básicas',
            'slug' => 'munecas-basicas',
            'is_active' => true,
            'parent_id' => $munecas->id,
        ]);

        // ========================================
        // 3. SUBCATEGORÍAS - Juguetes Íntimos
        // ========================================

        Category::create([
            'name' => 'Vibradores',
            'slug' => 'vibradores',
            'is_active' => true,
            'parent_id' => $juguetes->id,
        ]);

        Category::create([
            'name' => 'Dildos',
            'slug' => 'dildos',
            'is_active' => true,
            'parent_id' => $juguetes->id,
        ]);

        Category::create([
            'name' => 'Anillos Vibradores',
            'slug' => 'anillos-vibradores',
            'is_active' => true,
            'parent_id' => $juguetes->id,
        ]);

        // ========================================
        // 4. SUBCATEGORÍAS - Lubricantes
        // ========================================

        Category::create([
            'name' => 'Base Agua',
            'slug' => 'base-agua',
            'is_active' => true,
            'parent_id' => $lubricantes->id,
        ]);

        Category::create([
            'name' => 'Base Silicona',
            'slug' => 'base-silicona',
            'is_active' => true,
            'parent_id' => $lubricantes->id,
        ]);

        $this->command->info('✅ Categorías creadas: 12 categorías (5 raíz + 7 subcategorías)');
    }
}
