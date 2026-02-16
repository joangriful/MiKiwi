<?php

declare(strict_types=1);

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CleanupOldCarts implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        // Limpiar carritos de sesión expirados
        // En una implementación real, esto podría limpiar carritos
        // de usuarios no autenticados después de X días

        \Illuminate\Support\Facades\Log::info('Old carts cleanup job executed');
    }
}
