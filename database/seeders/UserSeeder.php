<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin
        User::create([
            'name' => 'Admin Boss',
            'email' => 'admin@kinky-toys.com',
            'password' => Hash::make('password'),
            'dni' => '00000000A',
            'birth_date' => '1990-01-01',
            'role' => 'admin',
        ]);

        // 2. Cliente de prueba específico
        User::create([
            'name' => 'Juan Cliente',
            'email' => 'juan@test.com',
            'password' => Hash::make('password'),
            'dni' => '12345678Z',
            'birth_date' => '2000-05-20',
            'role' => 'customer',
        ]);

        // 3. Clientes adicionales generados con factory
        User::factory()->count(20)->customer()->create();

        $this->command->info('✅ Usuarios creados: 23 total (1 admin + 1 test + 20 aleatorios)');
    }
}
