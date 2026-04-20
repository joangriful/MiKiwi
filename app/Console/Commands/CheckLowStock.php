<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Events\ProductLowStock;
use App\Models\Product;
use Illuminate\Console\Command;

class CheckLowStock extends Command
{
    protected $signature = 'stock:check {--threshold=10 : Umbral de stock bajo}';

    protected $description = 'Verificar productos con stock bajo y notificar';

    public function handle(): int
    {
        $threshold = (int) $this->option('threshold');

        $this->info("Verificando productos con stock menor a {$threshold}...");

        $lowStockProducts = Product::where('stock_quantity', '<', $threshold)
            ->where('is_active', true)
            ->get();

        foreach ($lowStockProducts as $product) {
            event(new ProductLowStock($product, $product->stock_quantity));
            $this->warn("Producto con stock bajo: {$product->name} ({$product->stock_quantity})");
        }

        $this->info("Se encontraron {$lowStockProducts->count()} productos con stock bajo.");

        return Command::SUCCESS;
    }
}
