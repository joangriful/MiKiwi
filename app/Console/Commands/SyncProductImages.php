<?php

namespace App\Console\Commands;

use App\Models\Product;
use App\Services\CloudinaryService;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class SyncProductImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products:sync-images {--folder=all : The Cloudinary folder to sync from (use "all" to search everything)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync product images from Cloudinary based on product slugs or SKUs';

    protected $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        parent::__construct();
        $this->cloudinaryService = $cloudinaryService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $folder = $this->option('folder');
        $this->info("Fetching images from Cloudinary folder: {$folder}...");

        $resources = $this->cloudinaryService->listProductImages($folder);

        if (empty($resources)) {
            $this->error("No images found in folder: {$folder}");
            return 1;
        }

        $this->info("Found " . count($resources) . " images. Fetching products...");

        $products = Product::all();
        $bar = $this->output->createProgressBar(count($products));
        $bar->start();

        $syncedCount = 0;

        foreach ($products as $product) {
            $matchedImages = [];
            $slug = $product->slug;
            $sku = $product->sku;

            foreach ($resources as $resource) {
                $filename = $resource['filename'];
                $publicId = $resource['public_id'];
                $url = $resource['secure_url'];

                // Logic: match if filename contains slug or SKU
                // We strip the Cloudinary random suffix if it exists (using original logic from CloudinaryService)
                $cleanName = preg_replace('/_[a-z0-9]{6}$/', '', $filename);

                if (
                    ($slug && (str_contains($cleanName, $slug) || str_contains($slug, $cleanName))) ||
                    ($sku && str_contains($cleanName, $sku))
                ) {
                    $matchedImages[] = $url;
                }
            }

            if (!empty($matchedImages)) {
                // Sort images to have a consistent primary image
                // If one matches the slug exactly (or plus extension), it should be first
                usort($matchedImages, function ($a, $b) use ($slug) {
                    $aName = pathinfo($a, PATHINFO_FILENAME);
                    $bName = pathinfo($b, PATHINFO_FILENAME);
                    
                    if ($aName === $slug) return -1;
                    if ($bName === $slug) return 1;
                    
                    return strcmp($a, $b);
                });

                $product->image_url = $matchedImages[0];
                $product->images = $matchedImages;
                $product->save();
                $syncedCount++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Successfully synced images for {$syncedCount} products.");

        return 0;
    }
}
