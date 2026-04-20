<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class LinkCollectionsToExistingCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        // Get the collection categories
        $paraElla = Category::where('slug', 'para-ella')->first();
        $paraEl = Category::where('slug', 'para-el')->first();
        $parejas = Category::where('slug', 'parejas')->first();
        $experiencias = Category::where('slug', 'experiencias')->first();

        if (!$paraElla || !$paraEl || !$parejas || !$experiencias) {
            $this->command->error('❌ Collection categories not found. Run CollectionCategoriesSeeder first.');
            return;
        }

        $updated = 0;

        // Para Ella: Female-oriented products
        // Includes: External stimulation, Internal (vaginal) stimulation, Anal stimulation
        $paraEllaCategories = [
            'estimulacion-externa',
            'estimulacion-interna',
            'estimulacion-anal',
        ];

        foreach ($paraEllaCategories as $slug) {
            $category = Category::where('slug', $slug)->first();
            if ($category && is_null($category->parent_id)) {
                $category->update(['parent_id' => $paraElla->id]);
                $this->command->line("  ✓ $slug ahora es hijo de Para Ella");
                $updated++;
            }
        }

        // Para Él: Male-oriented products
        // Includes: Penis/Testicles stimulation (don't reassign anal, it's shared via Parejas)
        $paraElCategories = [
            'pene-y-testiculos',
        ];

        foreach ($paraElCategories as $slug) {
            $category = Category::where('slug', $slug)->first();
            if ($category && is_null($category->parent_id)) {
                $category->update(['parent_id' => $paraEl->id]);
                $this->command->line("  ✓ $slug ahora es hijo de Para Él");
                $updated++;
            }
        }

        // Experiencias: BDSM products
        $experienciasCategories = [
            'bdsm-y-fetiche',
        ];

        foreach ($experienciasCategories as $slug) {
            $category = Category::where('slug', $slug)->first();
            if ($category && is_null($category->parent_id)) {
                $category->update(['parent_id' => $experiencias->id]);
                $this->command->line("  ✓ $slug ahora es hijo de Experiencias");
                $updated++;
            }
        }

        // Parejas: All non-BDSM categories
        // These remain as root categories OR can be children of Parejas if desired
        // For now, leave Cosmética y Cuidado as root, and the filtering logic will handle it
        $parejasCategories = [
            'estimulacion-externa',
            'estimulacion-interna',
            'estimulacion-anal',
            'pene-y-testiculos',
            'cosmetica-y-cuidado',
        ];

        // Note: Parejas needs special handling - it should show all products EXCEPT BDSM
        // This is handled by the ProductController filtering logic, not by parent-child relationships
        // So we don't reassign these categories to Parejas as parent

        $this->command->info("✅ LinkCollectionsToExistingCategoriesSeeder completado: $updated categorías actualizadas como hijos de colecciones");
        $this->command->info("   Para Ella contiene: Estimulación Externa, Interna y Anal");
        $this->command->info("   Para Él contiene: Pene y Testículos");
        $this->command->info("   Experiencias contiene: BDSM y Fetiche");
        $this->command->info("   Parejas: Usa filtrado especial que excluye BDSM (ver ProductController)");
    }
}
