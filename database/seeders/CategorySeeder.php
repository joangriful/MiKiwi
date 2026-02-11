<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

/**
 * CategorySeeder - Crea la estructura de categorías del catálogo MiKiwi
 *
 * Este seeder crea categorías reales del negocio con jerarquía padre-hijo.
 * Las categorías son fundamentales para la organización del catálogo.
 */
class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Desactivar restricciones de clave foránea para limpiar la tabla
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Category::truncate();
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $categories = [
            // 1. Estimulación Externa
            [
                'name' => 'Ondas de Presión',
                'description' => 'Succionadores de clítoris y estimuladores de aire pulsado.'
            ],
            [
                'name' => 'Vibradores Externos',
                'description' => 'Balas vibradoras, varitas (Wands) de masaje y estimuladores de contacto.'
            ],
            [
                'name' => 'Estimuladores de Pezones',
                'description' => 'Pinzas, ventosas y vibradores específicos.'
            ],

            // 2. Estimulación Interna
            [
                'name' => 'Estimuladores de Punto G',
                'description' => 'Juguetes con curvatura específica para masaje interno.'
            ],
            [
                'name' => 'Dildos',
                'description' => 'Juguetes de penetración sin vibración (silicona, vidrio, metal).'
            ],
            [
                'name' => 'Arneses y Strapless',
                'description' => 'Accesorios para penetración compartida.'
            ],
            [
                'name' => 'Salud Íntima',
                'description' => 'Ejercitadores de suelo pélvico y bolas chinas.'
            ],

            // 3. Estimulación de Pene y Testículos
            [
                'name' => 'Masturbadores',
                'description' => 'Manuales, automáticos y fundas (sleeves).'
            ],
            [
                'name' => 'Anillos Vibradores',
                'description' => 'Para erección y estimulación compartida.'
            ],
            [
                'name' => 'Bombas de Vacío',
                'description' => 'Salud sexual y estimulación física.'
            ],
            [
                'name' => 'Estimuladores de Próstata',
                'description' => 'Específicamente diseñados para el masaje interno del punto P.'
            ],

            // 4. Estimulación Anal
            [
                'name' => 'Plugs Anal',
                'description' => 'De diferentes tamaños, materiales y pesos.'
            ],
            [
                'name' => 'Dilatadores y Kits de Inicio',
                'description' => 'Para una exploración progresiva y segura.'
            ],
            [
                'name' => 'Cuentas y Bolas Anales',
                'description' => 'Para sensaciones de extracción y movimiento.'
            ],

            // 5. BDSM, Fetiche y Juego de Poder
            [
                'name' => 'Cuero y Textil',
                'description' => 'Arneses, máscaras, muñequeras y lencería funcional.'
            ],
            [
                'name' => 'Impacto',
                'description' => 'Látigos, palas (paddles), fustas y azotes.'
            ],
            [
                'name' => 'Restricción',
                'description' => 'Esposas, cuerdas (shibari), mordazas y vendas para los ojos.'
            ],
            [
                'name' => 'Sensaciones',
                'description' => 'Cera fría, plumas y estimuladores térmicos.'
            ],

            // 6. Cosmética y Cuidado
            [
                'name' => 'Lubricantes',
                'description' => 'Base agua, silicona y naturales.'
            ],
            [
                'name' => 'Cuidado del Cuerpo',
                'description' => 'Aceites de masaje, geles de efecto frío/calor y feromonas.'
            ],
            [
                'name' => 'Higiene',
                'description' => 'Limpiadores específicos para juguetes.'
            ],
        ];

        foreach ($categories as $catData) {
            Category::create([
                'name' => $catData['name'],
                'slug' => \Str::slug($catData['name']),
                'description' => $catData['description'],
                'is_active' => true,
                'parent_id' => null,
            ]);
        }

        $this->command->info('✅ Nuevas categorías (lista plana) creadas correctamente');
    }
}
