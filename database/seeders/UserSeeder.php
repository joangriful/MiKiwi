<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin
        User::firstOrCreate(
            ['email' => 'admin@kinky-toys.com'],
            [
                'name' => 'Admin Boss',
                'password' => Hash::make('password'),
                'dni' => '00000000A',
                'birth_date' => '1990-01-01',
                'role' => UserRole::Admin->value,
                'email_verified_at' => now(),
            ]
        );

        // 2. Cliente de prueba específico
        User::firstOrCreate(
            ['email' => 'juan@test.com'],
            [
                'name' => 'Juan Cliente',
                'password' => Hash::make('password'),
                'dni' => '12345678Z',
                'birth_date' => '2000-05-20',
                'role' => UserRole::Customer->value,
                'email_verified_at' => now(),
            ]
        );

        // 3. Clientes adicionales generados con factory
        // Solo crear si hay pocos usuarios
        if (User::count() < 10) {
            User::factory()->count(20)->customer()->create();
        }

        $this->command->info('✅ Usuarios base verificados/creados');
    }
}
