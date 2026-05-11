<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * AssignCategoriesSeeder
 *
 * Analiza el nombre y descripción de cada producto existente y le asigna
 * la subcategoría más apropiada basándose en un mapa de palabras clave.
 */
class AssignCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        // ─── 1. Construir mapa slug → id ───────────────────────────────────────
        $categoryMap = Category::all()->keyBy('slug');

        if ($categoryMap->isEmpty()) {
            $this->command->error('❌ No hay categorías. Ejecuta primero: php artisan db:seed --class=CategorySeeder');

            return;
        }

        // ─── 2. Mapa de palabras clave → slug de subcategoría ──────────────────
        // El orden importa: las reglas más específicas primero.
        $keywordRules = [
            // Estimulación Externa
            'ondas-de-presion' => ['succionador', 'succ', 'aire pulsado', 'clitoris', 'clítoris', 'air pulse', 'estimulador de aire'],
            'vibradores-externos' => ['bala vibrador', 'vibrador externo', 'vibrador de contacto', 'estimulador clitoral'],
            'wands-de-masaje' => ['wand', 'varita', 'magic wand', 'masajeador', 'masaje corporal'],
            'estimuladores-de-pezones' => ['pezón', 'pezones', 'pinza', 'ventosa pezón', 'nipple'],

            // Estimulación Interna
            'estimuladores-de-punto-g' => ['punto g', 'g-spot', 'punto-g', 'curvatura interna', 'masaje interno'],
            'dildos' => ['dildo', 'consolador', 'penetración sin vibr', 'silicona médica', 'vidrio', 'acero inoxidable'],
            'vibradores-internos' => ['vibrador interno', 'vibrador de inserción', 'rabbit', 'conejito', 'dual estimulacion'],
            'arneses-y-strapless' => ['arnés', 'arnes', 'strapless', 'strap-on', 'strapon', 'penetración compartida'],
            'salud-intima' => ['suelo pélvico', 'kegel', 'bolas chinas', 'ejercitador', 'pelvi'],

            // Pene y Testículos
            'masturbadores' => ['masturbador', 'funda', 'sleeve', 'stroker', 'fleshlight', 'pocket pussy'],
            'anillos-vibradores' => ['anillo', 'ring', 'cock ring', 'anillo vibrador', 'anillo de erección'],
            'bombas-de-vacio' => ['bomba de vacío', 'bomba de vacio', 'pump', 'pump pene', 'vacío'],
            'estimuladores-de-prostata' => ['próstata', 'prostata', 'punto p', 'p-spot', 'masaje prostático'],

            // Estimulación Anal
            'vibradores-anales' => ['vibrador anal', 'plug vibrante', 'vibrating plug'],
            'plugs-anales' => ['plug anal', 'plug', 'butt plug', 'tapón anal', 'anal plug'],
            'dilatadores-y-kits-de-inicio' => ['dilatador', 'kit anal', 'kit de inicio', 'kit principiante', 'set anal', 'progres'],
            'cuentas-y-bolas-anales' => ['cuentas anales', 'bolas anales', 'anal beads', 'rosario anal'],

            // BDSM y Fetiche
            'cuero-y-textil' => ['arnés bdsm', 'máscara', 'mascara', 'muñequera', 'collar bdsm', 'lencería fetiche', 'harness'],
            'impacto' => ['látigo', 'latigo', 'fusta', 'paddle', 'pala bdsm', 'azote', 'flogger', 'whip'],
            'restriccion' => ['esposa', 'cuerda', 'shibari', 'bondage', 'mordaza', 'venda ojos', 'restraint'],
            'sensaciones' => ['cera', 'pluma', 'sensorial', 'rueda wartenberg', 'elec', 'temperatura'],

            // Cosmética y Cuidado
            'lubricantes' => ['lubricante', 'lube', 'base agua', 'base silicona', 'gel íntimo', 'gel intimo'],
            'cuidado-del-cuerpo' => ['aceite de masaje', 'aceite íntimo', 'feromona', 'efecto calor', 'efecto frío', 'gel calor'],
            'higiene' => ['limpiador', 'spray limpiador', 'higiene juguete', 'toy cleaner', 'desinfectante íntimo'],

            // Genérico vibrador (después de los específicos)
            'vibradores-externos' => ['vibrador'],
        ];

        // ─── 3. Iterar productos y asignar categoría ───────────────────────────
        $products = Product::all();
        $updated = 0;
        $skipped = 0;

        foreach ($products as $product) {
            $searchText = Str::lower($product->name.' '.$product->description);

            $assignedSlug = null;

            foreach ($keywordRules as $slug => $keywords) {
                foreach ($keywords as $keyword) {
                    if (Str::contains($searchText, Str::lower($keyword))) {
                        $assignedSlug = $slug;
                        break 2;
                    }
                }
            }

            if ($assignedSlug && isset($categoryMap[$assignedSlug])) {
                $cat = $categoryMap[$assignedSlug];
                $product->update(['category_id' => $cat->id]);
                $this->command->line("  ✔ [{$product->name}] → {$cat->name}");
                $updated++;
            } else {
                $this->command->warn("  ⚠ [{$product->name}] → sin coincidencia, categoría no modificada");
                $skipped++;
            }
        }

        $this->command->info("✅ AssignCategoriesSeeder completado: {$updated} asignados, {$skipped} sin categoría detectada.");
    }
}
