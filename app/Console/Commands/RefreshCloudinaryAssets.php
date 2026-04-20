<?php

namespace App\Console\Commands;

use App\Domain\Media\Services\CloudinaryService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class RefreshCloudinaryAssets extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:refresh-cloudinary-assets {--force : Forzar el refresco de la caché incluso si el TTL no ha expirado}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Actualiza la caché de piezas del configurador desde Cloudinary (Pre-warming)';

    /**
     * Execute the console command.
     */
    public function handle(CloudinaryService $cloudinaryService): int
    {
        $this->info('🚀 Iniciando refresco de caché de Cloudinary...');
        
        $startTime = microtime(true);

        try {
            // Fetch fresh data from Cloudinary
            $this->comment('Consultando API de Cloudinary...');
            $views = $cloudinaryService->listDollParts();

            if (empty($views['front']) && empty($views['back'])) {
                $this->error('⚠️ La respuesta de Cloudinary está vacía. Abortando actualización para no sobreescribir con datos nulos.');
                return Command::FAILURE;
            }

            // Save to cache forever (it will be updated by this command again)
            Cache::forever('doll_parts_cloudinary', $views);
            
            $duration = round(microtime(true) - $startTime, 2);
            
            $this->info("✅ Caché actualizada correctamente en {$duration} segundos.");
            Log::info("Cloudinary Cache Pre-warmed successfully ({$duration}s).");

            return Command::SUCCESS;

        } catch (\Exception $e) {
            $this->error('❌ Error al actualizar la caché: ' . $e->getMessage());
            Log::error('Cloudinary Pre-warm failed: ' . $e->getMessage());
            
            return Command::FAILURE;
        }
    }
}
