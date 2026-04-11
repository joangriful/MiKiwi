<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Domain\Media\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ProductManagerController extends Controller
{
    protected $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }

    public function uploadProduct(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|unique:products,sku',
            'category_id' => 'nullable|uuid|exists:categories,id',
            'description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
            'stock_quantity' => 'nullable|integer|min:0',
            'product_type' => 'required|in:simple,configurable,component',
            'is_adult_only' => 'boolean',
            'is_active' => 'boolean',
            'images' => 'nullable|array',
            'images.*' => 'string',
            'image_url' => 'nullable|string',
            'hover_image_url' => 'nullable|string',
        ]);

        try {
            // Generate slug from name
            $slug = Str::slug($validated['name']);

            // Ensure unique slug
            $originalSlug = $slug;
            $counter = 1;
            while (Product::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }

            // Create product
            $product = Product::create([
                'name' => $validated['name'],
                'slug' => $slug,
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
                'images' => !empty($validated['images']) ? $validated['images'] : null,
            ]);

            return redirect()->back()->with('success', 'Producto creado correctamente');

        } catch (\Exception $e) {
            Log::error('Error uploading product: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error al crear el producto: ' . $e->getMessage());
        }
    }

    public function updateProduct(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'sku' => 'sometimes|string|unique:products,sku,' . $product->id,
            'category_id' => 'nullable|uuid|exists:categories,id',
            'description' => 'nullable|string',
            'base_price' => 'sometimes|numeric|min:0',
            'stock_quantity' => 'nullable|integer|min:0',
            'product_type' => 'sometimes|in:simple,configurable,component',
            'is_adult_only' => 'boolean',
            'is_active' => 'boolean',
            'is_featured' => 'sometimes|boolean',
            'images' => 'nullable|array',
            'images.*' => 'string',
            'image_url' => 'nullable|string',
            'hover_image_url' => 'nullable|string',
        ]);

        try {
            if (isset($validated['name']) && $validated['name'] !== $product->name) {
                $slug = Str::slug($validated['name']);
                $originalSlug = $slug;
                $counter = 1;
                while (Product::where('slug', $slug)->where('id', '!=', $product->id)->exists()) {
                    $slug = $originalSlug . '-' . $counter;
                    $counter++;
                }
                $validated['slug'] = $slug;
            }

            if (empty($validated['images'])) {
                $validated['images'] = null;
            }

            $product->update($validated);

            return redirect()->back()->with('success', 'Producto actualizado correctamente');

        } catch (\Exception $e) {
            Log::error('Error updating product: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error al actualizar el producto');
        }
    }

    public function deleteProduct(Product $product)
    {
        try {
            $product->delete();

            return redirect()->back()->with('success', 'Producto eliminado correctamente');

        } catch (\Exception $e) {
            Log::error('Error deleting product: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error al eliminar el producto');
        }
    }

    public function getProductImages(Request $request)
    {
        $productName = $request->input('product_name');
        if (empty($productName)) {
            return response()->json(['images' => []]);
        }

        $folder = 'productos/' . trim($productName);
        $images = $this->cloudinaryService->listProductImages($folder);
        
        // Formatear la lista para devolver solo la URL
        $imageUrls = collect($images)->map(function ($img) {
            return $img['secure_url'];
        })->toArray();

        return response()->json(['images' => $imageUrls]);
    }

    public function linkCloudinaryFolder(Request $request)
    {
        $validated = $request->validate([
            'product_name' => 'required|string',
            'source' => 'required|string'
        ]);

        $productName = trim($validated['product_name']);
        $source = trim($validated['source']);

        if (filter_var($source, FILTER_VALIDATE_URL)) {
            // Check for Cloudinary console URL (folders/%2F... or folder=%2F...)
            if (preg_match('/(?:folders\/|folder=)(%2F[^&]+|[^&\?]+)/', $source, $matches)) {
                $folder = urldecode($matches[1]);
                $folder = trim($folder, '/');
            } else {
                $parsed = parse_url($source, PHP_URL_PATH);
                if (!$parsed || $parsed === '/') {
                    return response()->json(['success' => false, 'error' => 'URL inválida o no contiene ruta a la imagen.'], 400);
                }
                $path = preg_replace('/^\/.*\/upload\/(v\d+\/)?/', '', $parsed);
                $folder = dirname($path);
            }
        } else {
            $folder = trim($source, '/');
        }

        // Clean up and validate folder
        $folder = trim(str_replace('\\', '/', $folder), '/');

        if ($folder === '.' || $folder === '') {
            return response()->json(['success' => false, 'error' => 'La URL que has pegado no contiene ninguna carpeta en su interior (es una imagen suelta en la raíz de Cloudinary). Cloudinary a veces oculta las carpetas en los links. Por favor, escribe manualmente el nombre de la carpeta (ej: "Mini Diva" o "productos/Mini Diva") en lugar de usar un link.'], 400);
        }

        $targetFolder = 'productos/' . $productName;

        try {
            // Si el origen simplemente era "Mini Diva", comprobamos si "productos/Mini Diva" ya existe
            if (strpos($folder, '/') === false) {
                $autoFolder = 'productos/' . $folder;
                // Si la auto-carpeta es idéntica al target, no hay que renombrar nada,
                // solo le decimos a React "todo ok" para que recargue y traiga las fotos.
                if ($autoFolder === $targetFolder) {
                    return response()->json(['success' => true, 'message' => 'Carpeta vinculada correctamente (ya tenía el nombre adecuado).']);
                }

                // Intento extra: renombrarlo si $autoFolder existe y es distinto al destino final
                try {
                    $adminApi = new \Cloudinary\Api\Admin\AdminApi();
                    $adminApi->renameFolder($autoFolder, $targetFolder);
                    return response()->json(['success' => true, 'message' => 'Carpeta vinculada con éxito.']);
                } catch (\Exception $e) {
                     // Ignorar y probar con el nombre original ($folder)
                }
            }

            if ($folder !== $targetFolder) {
                $adminApi = new \Cloudinary\Api\Admin\AdminApi();
                $adminApi->renameFolder($folder, $targetFolder);
            }
            return response()->json(['success' => true, 'message' => 'Carpeta vinculada (y renombrada si era necesario) con éxito.']);
        } catch (\GuzzleHttp\Exception\ClientException $e) {
             // Avoid HTML errors leaking
            return response()->json(['success' => false, 'error' => 'La carpeta de origen (' . $folder . ') no existe o no tiene imágenes.'], 400);
         } catch (\Exception $e) {
             \Log::error('Error linking folder: ' . $e->getMessage());
             return response()->json(['success' => false, 'error' => 'No se pudo vincular la carpeta. Verificá que exista en Cloudinary. (' . $folder . ')'], 400);
         }
     }

    public function uploadImagesTemp(Request $request)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'product_name' => 'required|string'
        ]);

        try {
            $productName = trim($request->input('product_name'));
            $slugPrefix = strtolower(preg_replace('/[^A-Za-z0-9\-]/', '-', $productName));
            $slugPrefix = preg_replace('/-+/', '-', $slugPrefix);
            $slugPrefix = trim($slugPrefix, '-');
            
            // Generate the dynamic folder dynamically
            $folder = 'productos/' . $slugPrefix;
            
            $uploadedUrls = [];

            foreach ($request->file('images') as $image) {
                // Upload directly to Cloudinary folder
                $cloudinaryResponse = $this->cloudinaryService->uploadImage($image, $folder);
                
                if (isset($cloudinaryResponse['secure_url'])) {
                    $uploadedUrls[] = $cloudinaryResponse['secure_url'];
                }
            }

            return response()->json([
                'success' => true,
                'urls' => $uploadedUrls,
                'message' => count($uploadedUrls) . ' imágenes subidas a ' . $folder
            ]);

        } catch (\Exception $e) {
            Log::error('Error en uploadImagesTemp: ' . $e->getMessage());
            return response()->json(['success' => false, 'error' => 'Error subiendo imágenes al servidor: ' . $e->getMessage()], 500);
        }
    }
}
