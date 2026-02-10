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

        $munecas = Category::firstOrCreate(
            ['slug' => 'munecas-realistas'],
            ['name' => 'Muñecas Realistas', 'is_active' => true, 'parent_id' => null]
        );

        $juguetes = Category::firstOrCreate(
            ['slug' => 'juguetes-intimos'],
            ['name' => 'Juguetes Íntimos', 'is_active' => true, 'parent_id' => null]
        );

        $lubricantes = Category::firstOrCreate(
            ['slug' => 'lubricantes'],
            ['name' => 'Lubricantes', 'is_active' => true, 'parent_id' => null]
        );

        $lenceria = Category::firstOrCreate(
            ['slug' => 'lenceria'],
            ['name' => 'Lencería', 'is_active' => true, 'parent_id' => null]
        );

        $componentes = Category::firstOrCreate(
            ['slug' => 'componentes'],
            ['name' => 'Componentes', 'is_active' => true, 'parent_id' => null]
        );

        // ========================================
        // 2. SUBCATEGORÍAS - Muñecas
        // ========================================

        Category::firstOrCreate(
            ['slug' => 'munecas-premium'],
            ['name' => 'Muñecas Premium', 'is_active' => true, 'parent_id' => $munecas->id]
        );

        Category::firstOrCreate(
            ['slug' => 'munecas-basicas'],
            ['name' => 'Muñecas Básicas', 'is_active' => true, 'parent_id' => $munecas->id]
        );

        // ========================================
        // 3. SUBCATEGORÍAS - Juguetes Íntimos
        // ========================================

        Category::firstOrCreate(
            ['slug' => 'vibradores'],
            ['name' => 'Vibradores', 'is_active' => true, 'parent_id' => $juguetes->id]
        );

        Category::firstOrCreate(
            ['slug' => 'dildos'],
            ['name' => 'Dildos', 'is_active' => true, 'parent_id' => $juguetes->id]
        );

        Category::firstOrCreate(
            ['slug' => 'anillos-vibradores'],
            ['name' => 'Anillos Vibradores', 'is_active' => true, 'parent_id' => $juguetes->id]
        );

        // ========================================
        // 4. SUBCATEGORÍAS - Lubricantes
        // ========================================

        Category::firstOrCreate(
            ['slug' => 'base-agua'],
            ['name' => 'Base Agua', 'is_active' => true, 'parent_id' => $lubricantes->id]
        );

        Category::firstOrCreate(
            ['slug' => 'base-silicona'],
            ['name' => 'Base Silicona', 'is_active' => true, 'parent_id' => $lubricantes->id]
        );

        $this->command->info('✅ Categorías verificadas/creadas');
    }
}
