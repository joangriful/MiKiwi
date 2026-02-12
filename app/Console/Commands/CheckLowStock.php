<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;
use Illuminate\Support\Facades\Log;

class CheckLowStock extends Command
{
    // Firma: php artisan stock:check
    protected $signature = 'stock:check {threshold=5 : Nivel mínimo de alerta}';

    protected $description = 'Revisa productos con stock bajo y notifica';

    public function handle()
    {
        $threshold = $this->argument('threshold');

        // Buscar productos con poco stock (Usamos stock_quantity para coincidir con la BD)
        $lowStockProducts = Product::where('stock_quantity', '<=', $threshold)->get();

        if ($lowStockProducts->isEmpty()) {
            $this->info("Todo el inventario está saludable.");
            return 0;
        }

        $this->warn("¡ATENCIÓN! Se encontraron {$lowStockProducts->count()} productos con stock bajo:");

        // Mostrar tabla en consola
        $headers = ['ID', 'Nombre', 'Stock Actual'];
        $data = $lowStockProducts->map(fn($p) => [$p->id, $p->name, $p->stock_quantity]);
        
        $this->table($headers, $data);

        // Aquí podrías disparar una notificación real al admin
        // Notification::route('mail', 'admin@tienda.com')->notify(new LowStockAlert($lowStockProducts));
        
        Log::warning("Alerta de Stock Bajo: {$lowStockProducts->count()} productos requieren atención.");

        return 0;
    }
}
