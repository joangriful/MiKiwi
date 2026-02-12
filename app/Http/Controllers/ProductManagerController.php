<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\CloudinaryService;
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
            'images.*' => 'image|max:10240', // Max 10MB per image
            'existing_images' => 'nullable|array',
            'existing_images.*' => 'string',
        ]);

        try {
            $imageUrls = [];
            $primaryImageUrl = null;

            // 1. Process existing Cloudinary IDs or URLs
            if ($request->has('existing_images')) {
                foreach ($request->input('existing_images') as $img) {
                    if (!empty(trim($img))) {
                        $imageUrls[] = $this->cloudinaryService->getImageUrl(trim($img));
                    }
                }
            }

            // 2. Upload new images to Cloudinary
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $cloudinaryResponse = $this->cloudinaryService->uploadImage(
                        $image,
                        'products'
                    );
                    $imageUrls[] = $cloudinaryResponse['secure_url'];
                }
            }

            // First image becomes primary
            if (!empty($imageUrls)) {
                $primaryImageUrl = $imageUrls[0];
            }

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
                'image_url' => $primaryImageUrl,
                'images' => !empty($imageUrls) ? $imageUrls : null,
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
            'existing_images' => 'nullable|array',
            'existing_images.*' => 'string',
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

            // Image handling
            if ($request->has('existing_images')) {
                $imageUrls = [];
                foreach ($request->input('existing_images') as $img) {
                    if (!empty(trim($img))) {
                        $imageUrls[] = $this->cloudinaryService->getImageUrl(trim($img));
                    }
                }

                $validated['images'] = !empty($imageUrls) ? $imageUrls : null;
                $validated['image_url'] = !empty($imageUrls) ? $imageUrls[0] : null;
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
}
