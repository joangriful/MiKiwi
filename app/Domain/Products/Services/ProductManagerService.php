<?php

declare(strict_types=1);

namespace App\Domain\Products\Services;

use App\Domain\Media\Services\CloudinaryService;
use App\Domain\Products\Support\ProductImageUrlNormalizer;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;

class ProductManagerService
{
    public function __construct(
        private readonly CloudinaryService $cloudinaryService,
    ) {}

    public function createProduct(array $validated): Product
    {
        if (! isset($validated['category_id'])) {
            throw new InvalidArgumentException('category_id is required for product creation.');
        }

        return DB::transaction(function () use ($validated) {
            $product = Product::query()->create([
                'name' => $validated['name'],
                'slug' => $this->generateUniqueSlug($validated['name']),
                'sku' => $validated['sku'] ?? Str::upper(Str::random(10)),
                'category_id' => $validated['category_id'],
                'description' => $validated['description'] ?? null,
                'base_price' => $validated['base_price'],
                'stock_quantity' => $validated['stock_quantity'] ?? 0,
                'product_type' => $validated['product_type'],
                'is_adult_only' => $validated['is_adult_only'] ?? true,
                'is_active' => $validated['is_active'] ?? true,
                'is_promoted' => $validated['is_promoted'] ?? false,
            ]);

            $this->syncProductImages($product, $validated['images'] ?? []);

            return $product->fresh(['images']);
        });
    }

    public function updateProduct(Product $product, array $validated): Product
    {
        if (isset($validated['name']) && $validated['name'] !== $product->name) {
            $validated['slug'] = $this->generateUniqueSlug($validated['name'], $product->id);
        }

        $isPromoted = $validated['is_promoted'] ?? null;
        if ($isPromoted !== null) {
            $validated['is_promoted'] = (bool) $isPromoted;
        }

        unset($validated['image_url'], $validated['hover_image_url']);

        DB::transaction(function () use ($product, $validated): void {
            $product->update(Arr::except($validated, ['images']));

            if (array_key_exists('images', $validated)) {
                $this->syncProductImages($product, $validated['images']);
            }
        });

        return $product->fresh(['images']);
    }

    public function deleteProduct(Product $product): void
    {
        $product->delete();
    }

    public function getProductImageUrls(string $productName): array
    {
        $folder = 'productos/'.trim($productName);
        $images = $this->cloudinaryService->listProductImages($folder);

        return collect($images)
            ->map(fn ($image) => $image['secure_url'])
            ->toArray();
    }

    public function linkCloudinaryFolder(string $productName, string $source): array
    {
        $folder = $this->resolveSourceFolder($source);

        if ($folder === '.' || $folder === '') {
            return [
                'success' => false,
                'status' => 400,
                'error' => 'La URL que has pegado no contiene ninguna carpeta en su interior (es una imagen suelta en la raíz de Cloudinary). Cloudinary a veces oculta las carpetas en los links. Por favor, escribe manualmente el nombre de la carpeta (ej: "Mini Diva" o "productos/Mini Diva") en lugar de usar un link.',
            ];
        }

        $targetFolder = 'productos/'.trim($productName);

        try {
            if (strpos($folder, '/') === false) {
                $autoFolder = 'productos/'.$folder;

                if ($autoFolder === $targetFolder) {
                    return [
                        'success' => true,
                        'message' => 'Carpeta vinculada correctamente (ya tenía el nombre adecuado).',
                    ];
                }

                try {
                    $adminApi = new \Cloudinary\Api\Admin\AdminApi;
                    $adminApi->renameFolder($autoFolder, $targetFolder);

                    return [
                        'success' => true,
                        'message' => 'Carpeta vinculada con éxito.',
                    ];
                } catch (\Exception) {
                    // Continue with resolved source folder.
                }
            }

            if ($folder !== $targetFolder) {
                $adminApi = new \Cloudinary\Api\Admin\AdminApi;
                $adminApi->renameFolder($folder, $targetFolder);
            }

            return [
                'success' => true,
                'message' => 'Carpeta vinculada (y renombrada si era necesario) con éxito.',
            ];
        } catch (\GuzzleHttp\Exception\ClientException) {
            return [
                'success' => false,
                'status' => 400,
                'error' => 'La carpeta de origen ('.$folder.') no existe o no tiene imágenes.',
            ];
        } catch (\Exception) {
            return [
                'success' => false,
                'status' => 400,
                'error' => 'No se pudo vincular la carpeta. Verificá que exista en Cloudinary. ('.$folder.')',
            ];
        }
    }

    public function uploadImagesTemp(array $images, string $productName): array
    {
        $slugPrefix = strtolower(preg_replace('/[^A-Za-z0-9\-]/', '-', trim($productName)));
        $slugPrefix = preg_replace('/-+/', '-', $slugPrefix);
        $slugPrefix = trim($slugPrefix, '-');

        $folder = 'productos/'.$slugPrefix;
        $uploadedUrls = [];

        foreach ($images as $image) {
            $cloudinaryResponse = $this->cloudinaryService->uploadImage($image, $folder);

            if (isset($cloudinaryResponse['secure_url'])) {
                $uploadedUrls[] = $cloudinaryResponse['secure_url'];
            }
        }

        return [
            'urls' => $uploadedUrls,
            'folder' => $folder,
        ];
    }

    private function generateUniqueSlug(string $name, ?string $ignoreId = null): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        while (
            Product::where('slug', $slug)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $originalSlug.'-'.$counter;
            $counter++;
        }

        return $slug;
    }

    private function resolveSourceFolder(string $source): string
    {
        $source = trim($source);

        if (! filter_var($source, FILTER_VALIDATE_URL)) {
            return trim(str_replace('\\', '/', $source), '/');
        }

        if (preg_match('/(?:folders\/|folder=)(%2F[^&]+|[^&\?]+)/', $source, $matches)) {
            return trim(urldecode($matches[1]), '/');
        }

        $parsed = parse_url($source, PHP_URL_PATH);

        if (! $parsed || $parsed === '/') {
            return '';
        }

        $path = preg_replace('/^\/.*\/upload\/(v\d+\/)?/', '', $parsed);

        return trim(str_replace('\\', '/', dirname($path)), '/');
    }

    private function syncProductImages(Product $product, mixed $imagePayload): void
    {
        ProductImage::query()->where('product_id', $product->id)->delete();

        foreach (ProductImageUrlNormalizer::normalize($imagePayload) as $index => $imageUrl) {
            ProductImage::query()->create([
                'product_id' => $product->id,
                'public_id' => Str::uuid()->toString(),
                'image_url' => $imageUrl,
                'alt_text' => $product->name,
                'sort_order' => $index,
            ]);
        }
    }
}
