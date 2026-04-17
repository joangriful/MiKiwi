<?php

namespace App\Domain\Products\Services;

use App\Domain\Media\Services\CloudinaryService;
use App\Models\Product;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class ProductManagerService
{
    public function __construct(
        private readonly CloudinaryService $cloudinaryService,
    ) {
    }

    public function createProduct(array $validated): Product
    {
        return Product::create([
            'name' => $validated['name'],
            'slug' => $this->generateUniqueSlug($validated['name']),
            'sku' => $validated['sku'] ?? null,
            'category_id' => $validated['category_id'] ?? null,
            'description' => $validated['description'] ?? null,
            'base_price' => $validated['base_price'],
            'stock_quantity' => $validated['stock_quantity'] ?? null,
            'product_type' => $validated['product_type'],
            'is_adult_only' => $validated['is_adult_only'] ?? true,
            'is_active' => $validated['is_active'] ?? true,
            'image_url' => $validated['image_url'] ?? null,
            'hover_image_url' => $validated['hover_image_url'] ?? null,
            'images' => ! empty($validated['images']) ? $validated['images'] : null,
        ]);
    }

    public function updateProduct(Product $product, array $validated): Product
    {
        if (isset($validated['name']) && $validated['name'] !== $product->name) {
            $validated['slug'] = $this->generateUniqueSlug($validated['name'], $product->id);
        }

        if (array_key_exists('images', $validated) && empty($validated['images'])) {
            $validated['images'] = null;
        }

        $product->update($validated);

        return $product->fresh();
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
}
