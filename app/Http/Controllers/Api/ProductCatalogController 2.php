<?php

namespace App\Http\Controllers\Api;

use App\Domain\Products\Services\ProductService;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductCatalogController extends Controller
{
    protected $productService;

    // Inyectamos el Servicio (el cerebro)
    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    // GET /api/products
    public function index(): AnonymousResourceCollection
    {
        $products = $this->productService->getCatalogItems();

        return ProductResource::collection($products);
    }

    // GET /api/products/{slug}
    public function show(string $slug): JsonResponse
    {
        try {
            $data = $this->productService->getProductDetails($slug);

            return response()->json([
                'success' => true,
                'data' => [
                    'product' => ProductResource::make($data['product']),
                    'accessories' => ProductResource::collection($data['accessories']),
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Producto no encontrado'], 404);
        }
    }
}
