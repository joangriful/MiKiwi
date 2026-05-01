<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $isDevelopmentLikeEnvironment = app()->environment(['local', 'development', 'testing']);

        $targetSeeder = $isDevelopmentLikeEnvironment
            ? DevelopmentDatabaseSeeder::class
            : ProductionDatabaseSeeder::class;

        $this->call($targetSeeder);
    }
}
