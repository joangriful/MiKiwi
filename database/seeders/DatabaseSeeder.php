<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('🌱 Iniciando seeding de la base de datos MiKiwi...');
        $this->command->newLine();

        $this->command->info('📍 Fase 1: Creando usuarios y categorías...');
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            NewCategorySeeder::class,
            CollectionCategoriesSeeder::class,
        ]);
        
        // --- VALIDACIÓN CRÍTICA ---
        // Forzamos a Laravel a refrescar la lectura de categorías creadas justo arriba
        $categoriesExist = Category::exists();

        if (! $categoriesExist) {
            $this->command->error("❌ ERROR: CategorySeeder terminó pero la tabla sigue vacía.");
            $this->command->info('Reintentando contar por DB directa: '.DB::table('category')->count());
            return;
        }
        $this->command->info("✅ Categorías detectadas correctamente.");
        $this->command->newLine();
        // --------------------------

        $this->command->info('📍 Fase 2: Creando productos del catálogo...');
        $this->call([
            ProductSeeder::class,
        ]);
        $this->command->newLine();

        $this->command->info('📍 Fase 3: Creando órdenes históricas...');
        $this->call([
            OrderSeeder::class,
        ]);
        $this->command->newLine();

        $this->command->info('📍 Fase 4: Creando reviews, chat y puntos de recogida...');
        $this->call([
            ReviewSeeder::class,
            ChatSessionSeeder::class,
            PickupPointSeeder::class,
        ]);
        $this->command->newLine();

        $this->command->info('✅ Seeding completado exitosamente!');
    }
}
