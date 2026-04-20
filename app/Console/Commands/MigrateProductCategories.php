<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class MigrateProductCategories extends Command
{
    protected $signature = 'products:migrate-categories';
    protected $description = 'Migrate existing products to the new category structure based on keywords';

    public function handle()
    {
        $this->info('Starting product category migration...');

        $mapping = [
            'Succión y Aire' => ['succión', 'aire', 'suck', 'air'],
            'Vibradores Internos' => ['interno', 'vibrador', 'conejo', 'rabbit', 'g-spot'],
            'Estimulación Externa' => ['externo', 'clítoris', 'clitorial', 'vibrador externo'],
            'Masturbadores' => ['masturbador', 'manga', 'sleeve', 'stroker'],
            'Masaje de Próstata' => ['próstata', 'prostate'],
            'Anillos Vibradores' => ['anillo', 'ring'],
            'Control a Distancia' => ['distancia', 'remoto', 'remote', 'app'],
            'Juguetes Compartidos' => ['compartido', 'pareja', 'couple'],
            'Accesorios de Juego' => ['juego', 'game', 'play'],
            'Lubricantes Base Agua' => ['agua', 'water', 'lube'],
            'Aceites y Velas' => ['aceite', 'vela', 'oil', 'candle'],
            'Geles Estimulantes' => ['gel', 'stimulant'],
            'Kits para Principiantes' => ['principiante', 'beginner', 'kit'],
            'Packs de Regalo' => ['regalo', 'gift', 'pack'],
            'Kits de Viaje' => ['viaje', 'travel'],
            'Limpieza e Higiene' => ['limpieza', 'clean', 'hygiene'],
            'Cables y Recambios' => ['cable', 'recambio', 'spare', 'charger'],
            'Fundas y Guardado' => ['funda', 'guardado', 'case', 'bag'],
        ];

        $products = Product::all();
        $total = $products->count();
        $migrated = 0;

        foreach ($products as $product) {
            $text = Str::lower($product->name . ' ' . $product->description);
            $found = false;

            foreach ($mapping as $categoryName => $keywords) {
                foreach ($keywords as $keyword) {
                    if (Str::contains($text, $keyword)) {
                        $category = Category::where('name', $categoryName)->first();
                        if ($category) {
                            $product->category_id = $category->id;
                            $product->save();
                            $migrated++;
                            $found = true;
                            break 2;
                        }
                    }
                }
            }

            if (!$found) {
                $this->warn("No mapping found for: {$product->name}");
            }
        }

        $this->info("Migration completed. {$migrated}/{$total} products updated.");
    }
}
