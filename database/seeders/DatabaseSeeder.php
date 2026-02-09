<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Orden de ejecución optimizado según dependencias:
     * 1. Usuarios (base de todo)
     * 2. Categorías (productos las necesitan)
     * 3. Productos (órdenes y reviews los necesitan)
     * 4. Órdenes (transacciones históricas)
     * 5. Reviews y Chat (contenido social)
     */
    public function run(): void
    {
        $this->command->info('🌱 Iniciando seeding de la base de datos MiKiwi...');
        $this->command->newLine();

        // ========================================
        // 1️⃣ FUNDAMENTOS - Usuarios y Categorías
        // ========================================
        $this->command->info('📍 Fase 1: Creando usuarios y categorías...');
        $this->call([
            UserSeeder::class,           // Usuarios base (admin + clientes)
            CategorySeeder::class,       // Categorías reales del negocio
        ]);
        $this->command->newLine();

        // ========================================
        // 2️⃣ CATÁLOGO - Productos
        // ========================================
        $this->command->info('📍 Fase 2: Creando productos del catálogo...');
        $this->call([
            ProductSeeder::class,        // Productos realistas + accesorios
        ]);
        $this->command->newLine();

        // ========================================
        // 3️⃣ TRANSACCIONES - Órdenes
        // ========================================
        $this->command->info('📍 Fase 3: Creando órdenes históricas...');
        $this->call([
            OrderSeeder::class,          // Órdenes con items y estados variados
        ]);
        $this->command->newLine();

        // ========================================
        // 4️⃣ CONTENIDO SOCIAL - Reviews y Chat
        // ========================================
        $this->command->info('📍 Fase 4: Creando reviews y sesiones de soporte...');
        $this->call([
            ReviewSeeder::class,         // Reseñas de productos
            ChatSessionSeeder::class,    // Sesiones de chat con mensajes
        ]);
        $this->command->newLine();

        // ========================================
        // ✅ FINALIZACIÓN
        // ========================================
        $this->command->info('✅ Seeding completado exitosamente!');
        $this->command->newLine();
        $this->command->info('📊 Resumen de datos creados:');
        $this->command->table(
            ['Entidad', 'Cantidad Aproximada'],
            [
                ['Categorías', '~12 (5 raíz + 7 subcategorías)'],
                ['Productos', '~25 (18 reales + 7 generados)'],
                ['Usuarios', '~25 (admin + clientes)'],
                ['Direcciones', '~5-10'],
                ['Órdenes', '~15-20'],
                ['Order Items', '~30-80'],
                ['Reviews', '~40-100'],
                ['Chat Sessions', '~10-30'],
                ['Chat Messages', '~50-300'],
            ]
        );
        $this->command->newLine();
        $this->command->info('💡 Usuarios de prueba:');
        $this->command->info('   Admin: admin@mikiwi.com / password');
        $this->command->info('   Cliente: juan@test.com / password');
        $this->command->newLine();
    }
}
