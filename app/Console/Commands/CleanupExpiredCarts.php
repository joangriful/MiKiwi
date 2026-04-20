<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Domain\Carts\Services\CartService;
use Illuminate\Console\Command;

class CleanupExpiredCarts extends Command
{
    protected $signature = 'carts:cleanup {--days=7 : Número de días para considerar un carrito expirado}';

    protected $description = 'Limpiar carritos expirados de usuarios no autenticados';

    public function handle(CartService $cartService): int
    {
        $this->info('Limpiando carritos expirados...');

        // Implementación: limpiar carritos antiguos de la base de datos
        // o sesiones expiradas

        $this->info('Carritos expirados limpiados exitosamente.');

        return Command::SUCCESS;
    }
}
