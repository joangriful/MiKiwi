<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * CategorySeeder - Crea la estructura jerárquica de categorías del catálogo MiKiwi
 *
 * 6 categorías padre, cada una con sus subcategorías.
 * La relación padre-hijo se usa para los filtros y el selector del administrador.
 */
class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Desactivar restricciones de clave foránea para limpiar la tabla
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Category::truncate();
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $structure = [
            // ─── 1. Estimulación Externa ───────────────────────────────────────────
            [
                'name'        => 'Estimulación Externa',
                'description' => 'Juguetes diseñados para estimulación clitoriana y externa.',
                'children'    => [
                    ['name' => 'Ondas de Presión',       'description' => 'Succionadores de clítoris y estimuladores de aire pulsado.'],
                    ['name' => 'Vibradores Externos',     'description' => 'Balas vibradoras, wands de masaje y estimuladores de contacto.'],
                    ['name' => 'Wands de Masaje',         'description' => 'Varitas de masaje de alta potencia para todo el cuerpo.'],
                    ['name' => 'Estimuladores de Pezones','description' => 'Pinzas, ventosas y vibradores específicos para pezones.'],
                ],
            ],

            // ─── 2. Estimulación Interna ───────────────────────────────────────────
            [
                'name'        => 'Estimulación Interna',
                'description' => 'Juguetes para penetración y masaje interno.',
                'children'    => [
                    ['name' => 'Estimuladores de Punto G', 'description' => 'Juguetes con curvatura específica para masaje del punto G.'],
                    ['name' => 'Dildos',                   'description' => 'Juguetes de penetración sin vibración (silicona, vidrio, metal).'],
                    ['name' => 'Vibradores Internos',      'description' => 'Vibradores de inserción con múltiples modos de vibración.'],
                    ['name' => 'Arneses y Strapless',      'description' => 'Accesorios para penetración compartida y doble estimulación.'],
                    ['name' => 'Salud Íntima',             'description' => 'Ejercitadores de suelo pélvico y bolas chinas.'],
                ],
            ],

            // ─── 3. Pene y Testículos ──────────────────────────────────────────────
            [
                'name'        => 'Pene y Testículos',
                'description' => 'Estimulación masculina y salud sexual del pene.',
                'children'    => [
                    ['name' => 'Masturbadores',           'description' => 'Masturbadores manuales, automáticos y fundas (sleeves).'],
                    ['name' => 'Anillos Vibradores',      'description' => 'Anillos para erección y estimulación compartida.'],
                    ['name' => 'Bombas de Vacío',         'description' => 'Para salud sexual y estimulación física del pene.'],
                    ['name' => 'Estimuladores de Próstata','description' => 'Diseñados para el masaje interno del punto P.'],
                ],
            ],

            // ─── 4. Estimulación Anal ──────────────────────────────────────────────
            [
                'name'        => 'Estimulación Anal',
                'description' => 'Juguetes para exploración anal, para todos los géneros.',
                'children'    => [
                    ['name' => 'Plugs Anales',              'description' => 'Plugs de diferentes tamaños, materiales y pesos.'],
                    ['name' => 'Dilatadores y Kits de Inicio','description' => 'Para una exploración progresiva y segura.'],
                    ['name' => 'Cuentas y Bolas Anales',    'description' => 'Para sensaciones de extracción y movimiento.'],
                    ['name' => 'Vibradores Anales',         'description' => 'Plugs y vibradores con vibración para estimulación anal.'],
                ],
            ],

            // ─── 5. BDSM y Fetiche ─────────────────────────────────────────────────
            [
                'name'        => 'BDSM y Fetiche',
                'description' => 'Juguetes y accesorios para juego de poder, fetiche y exploración BDSM.',
                'children'    => [
                    ['name' => 'Cuero y Textil',  'description' => 'Arneses, máscaras, muñequeras y lencería funcional.'],
                    ['name' => 'Impacto',          'description' => 'Látigos, palas (paddles), fustas y azotes.'],
                    ['name' => 'Restricción',      'description' => 'Esposas, cuerdas (shibari), mordazas y vendas para los ojos.'],
                    ['name' => 'Sensaciones',      'description' => 'Cera fría/caliente, plumas y estimuladores térmicos.'],
                ],
            ],

            // ─── 6. Cosmética y Cuidado ────────────────────────────────────────────
            [
                'name'        => 'Cosmética y Cuidado',
                'description' => 'Lubricantes, aceites y productos de higiene para el cuidado íntimo.',
                'children'    => [
                    ['name' => 'Lubricantes',        'description' => 'Base agua, silicona y naturales para mayor comodidad.'],
                    ['name' => 'Cuidado del Cuerpo', 'description' => 'Aceites de masaje, geles de efecto frío/calor y feromonas.'],
                    ['name' => 'Higiene',            'description' => 'Limpiadores específicos para juguetes y accesorios íntimos.'],
                ],
            ],
        ];

        foreach ($structure as $parentData) {
            // Crear categoría padre
            $parent = Category::create([
                'name'        => $parentData['name'],
                'slug'        => Str::slug($parentData['name']),
                'description' => $parentData['description'],
                'is_active'   => true,
                'parent_id'   => null,
            ]);

            // Crear subcategorías
            foreach ($parentData['children'] as $childData) {
                Category::create([
                    'name'        => $childData['name'],
                    'slug'        => Str::slug($childData['name']),
                    'description' => $childData['description'],
                    'is_active'   => true,
                    'parent_id'   => $parent->id,
                ]);
            }
        }

        $total = Category::count();
        $parents = Category::whereNull('parent_id')->count();
        $children = Category::whereNotNull('parent_id')->count();

        $this->command->info("✅ CategorySeeder completado: {$parents} categorías padre, {$children} subcategorías ({$total} total)");
    }
}
