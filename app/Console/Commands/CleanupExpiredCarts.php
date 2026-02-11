<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CleanupExpiredCarts extends Command
{
    /**
     * El nombre y la firma del comando en la consola.
     * Ejemplo de uso: php artisan carts:cleanup
     */
    protected $signature = 'carts:cleanup {days=7 : Días de antigüedad para borrar}';

    /**
     * Descripción del comando.
     */
    protected $description = 'Elimina los carritos abandonados más antiguos de X días';

    /**
     * Ejecución del comando.
     */
    public function handle()
    {
        $days = $this->argument('days');
        
        // Calculamos la fecha límite
        $dateLimit = now()->subDays($days);

        // Opción B: Usamos tabla directa (más rápido para limpiezas masivas)
        // Se asume que existe una tabla 'carts' o que se usa el driver de base de datos para sesiones
        $deletedCount = DB::table('carts')
            ->where('updated_at', '<', $dateLimit)
            ->delete();

        $this->info("Se han eliminado {$deletedCount} carritos expirados (más de {$days} días).");
        
        return 0;
    }
}
