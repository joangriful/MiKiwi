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
        // Aquí decimos: "Ejecuta los otros archivos"
        $this->call([
            UserSeeder::class,
            CatalogSeeder::class,
        ]);
    }
}
