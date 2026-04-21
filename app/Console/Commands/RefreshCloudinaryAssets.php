<?php

namespace App\Console\Commands;

use App\Domain\Media\Services\CloudinaryAssetCacheService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Throwable;

class RefreshCloudinaryAssets extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:refresh-cloudinary-assets';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Refreshes the configurator doll parts cache from Cloudinary.';

    /**
     * Execute the console command.
     */
    public function handle(CloudinaryAssetCacheService $assetCacheService): int
    {
        $this->info('Refreshing Cloudinary doll parts cache...');

        $startTime = microtime(true);

        try {
            $this->comment('Fetching doll parts from Cloudinary...');
            $assetCacheService->refreshDollParts();

            $duration = round(microtime(true) - $startTime, 2);

            $this->info("Cloudinary doll parts cache refreshed in {$duration} seconds.");
            Log::info('Cloudinary doll parts cache refreshed.', [
                'duration_seconds' => $duration,
            ]);

            return Command::SUCCESS;
        } catch (Throwable $exception) {
            $this->error('Cloudinary cache refresh failed: '.$exception->getMessage());
            Log::error('Cloudinary doll parts cache refresh failed.', [
                'exception' => $exception,
            ]);

            return Command::FAILURE;
        }
    }
}
