<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DevelopmentDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🌱 Iniciando seeding de desarrollo MiKiwi...');
        $this->command->newLine();

        $this->command->info('📍 Fase 1: Cargando base de producción...');
        $this->call([
            ProductionDatabaseSeeder::class,
        ]);
        $this->command->newLine();

        $this->command->info('📍 Fase 2: Creando usuarios de prueba y catálogo demo...');
        $this->call([
            UserSeeder::class,
            ProductSeeder::class,
        ]);

        if (User::count() < 10) {
            User::factory()->count(20)->customer()->create();
        }

        $this->command->newLine();

        $this->command->info('📍 Fase 3: Creando histórico y soporte demo...');
        $this->call([
            OrderSeeder::class,
            ReviewSeeder::class,
            ChatSessionSeeder::class,
        ]);
        $this->command->newLine();

        $this->command->info('✅ Seeding de desarrollo completado.');
    }
}
