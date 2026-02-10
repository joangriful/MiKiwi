<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

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
        ]);
        $this->command->newLine();

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
