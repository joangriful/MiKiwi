<?php

namespace App\Http\Controllers;

use App\Domain\Products\Services\ProductManagerService;
use App\Enums\ProductType;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class ProductManagerController extends Controller
{
    public function __construct(
        private readonly ProductManagerService $productManagerService,
    ) {}

    public function uploadProduct(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|unique:products,sku',
            'category_id' => 'nullable|uuid|exists:categories,id',
            'description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
            'stock_quantity' => 'nullable|integer|min:0',
            'product_type' => ['required', Rule::in(ProductType::values())],
            'is_adult_only' => 'boolean',
            'is_active' => 'boolean',
            'images' => 'nullable|array',
            'images.*' => 'string',
            'image_url' => 'nullable|string',
            'hover_image_url' => 'nullable|string',
        ]);

        try {
            $this->productManagerService->createProduct($validated);

            return redirect()->back()->with('success', 'Producto creado correctamente');

        } catch (\Exception $e) {
            Log::error('Error uploading product: '.$e->getMessage());

            return redirect()->back()->with('error', 'Error al crear el producto: '.$e->getMessage());
        }
    }

    public function updateProduct(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'sku' => 'sometimes|string|unique:products,sku,'.$product->getKey(),
            'category_id' => 'nullable|uuid|exists:categories,id',
            'description' => 'nullable|string',
            'base_price' => 'sometimes|numeric|min:0',
            'stock_quantity' => 'nullable|integer|min:0',
            'product_type' => ['sometimes', Rule::in(ProductType::values())],
            'is_adult_only' => 'boolean',
            'is_active' => 'boolean',
            'is_featured' => 'sometimes|boolean',
            'images' => 'nullable|array',
            'images.*' => 'string',
            'image_url' => 'nullable|string',
            'hover_image_url' => 'nullable|string',
        ]);

        try {
            $this->productManagerService->updateProduct($product, $validated);

            return redirect()->back()->with('success', 'Producto actualizado correctamente');

        } catch (\Exception $e) {
            Log::error('Error updating product: '.$e->getMessage());

            return redirect()->back()->with('error', 'Error al actualizar el producto');
        }
    }

    public function deleteProduct(Product $product)
    {
        try {
            $this->productManagerService->deleteProduct($product);

            return redirect()->back()->with('success', 'Producto eliminado correctamente');

        } catch (\Exception $e) {
            Log::error('Error deleting product: '.$e->getMessage());

            return redirect()->back()->with('error', 'Error al eliminar el producto');
        }
    }

    public function getProductImages(Request $request)
    {
        $productName = $request->input('product_name');
        if (empty($productName)) {
            return response()->json(['images' => []]);
        }

        return response()->json([
            'images' => $this->productManagerService->getProductImageUrls($productName),
        ]);
    }

    public function linkCloudinaryFolder(Request $request)
    {
        $validated = $request->validate([
            'product_name' => 'required|string',
            'source' => 'required|string',
        ]);

        $result = $this->productManagerService->linkCloudinaryFolder(
            $validated['product_name'],
            $validated['source']
        );

        try {
            if (! $result['success']) {
                return response()->json($result, $result['status'] ?? 400);
            }

            return response()->json($result);
        } catch (\Exception $e) {
            Log::error('Error linking folder: '.$e->getMessage());

            return response()->json(['success' => false, 'error' => 'No se pudo vincular la carpeta.'], 400);
        }
    }

    public function uploadImagesTemp(Request $request)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'product_name' => 'required|string',
        ]);

        try {
            $uploadResult = $this->productManagerService->uploadImagesTemp(
                $request->file('images'),
                $request->input('product_name')
            );

            return response()->json([
                'success' => true,
                'urls' => $uploadResult['urls'],
                'message' => count($uploadResult['urls']).' imágenes subidas a '.$uploadResult['folder'],
            ]);

        } catch (\Exception $e) {
            Log::error('Error en uploadImagesTemp: '.$e->getMessage());

            return response()->json(['success' => false, 'error' => 'Error subiendo imágenes al servidor: '.$e->getMessage()], 500);
        }
    }
}
