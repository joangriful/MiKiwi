<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductionDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🌱 Iniciando seeding de producción MiKiwi...');
        $this->command->newLine();

        $this->command->info('📍 Cargando catálogos base y datos operativos...');
        $this->call([
            CategorySeeder::class,
            CollectionCategoriesSeeder::class,
            PickupPointSeeder::class,
        ]);

        if (! Category::exists()) {
            $this->command->error('❌ ERROR: CategorySeeder terminó pero la tabla sigue vacía.');
            $this->command->info('Reintentando contar por DB directa: '.DB::table('category')->count());

            return;
        }

        $this->command->newLine();
        $this->command->info('✅ Seeding de producción completado.');
    }
}
