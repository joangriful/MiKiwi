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

        $baseCustomers = [
            ['email' => 'angel@gmail.com', 'name' => 'Angel', 'dni' => '10000001A'],
            ['email' => 'joan@gmail.com', 'name' => 'Joan', 'dni' => '10000002B'],
            ['email' => 'ismael@gmail.com', 'name' => 'Ismael', 'dni' => '10000003C'],
            ['email' => 'miguel@gmail.com', 'name' => 'Miguel', 'dni' => '10000004D'],
            ['email' => 'alberto@gmail.com', 'name' => 'Alberto', 'dni' => '10000005E'],
            ['email' => 'elena@gmail.com', 'name' => 'Elena', 'dni' => '10000006F'],
        ];

        foreach ($baseCustomers as $customer) {
            User::firstOrCreate(
                ['email' => $customer['email']],
                [
                    'name' => $customer['name'],
                    'password' => Hash::make('password'),
                    'dni' => $customer['dni'],
                    'birth_date' => '1995-01-01',
                    'role' => UserRole::Customer->value,
                    'email_verified_at' => now(),
                ]
            );
        }

        $this->command->info('✅ Usuarios base verificados/creados');
    }
}
