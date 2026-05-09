<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductionDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            CollectionCategoriesSeeder::class,
            ProductSeeder::class,
            PrefabDollSeeder::class,
            CouponSeeder::class,
            PickupPointSeeder::class,
        ]);

        if (! Category::exists()) {
            $this->command->error('CategorySeeder termino pero la tabla sigue vacia.');
            $this->command->info('Reintentando contar por DB directa: '.DB::table('category')->count());

            return;
        }
    }
}
