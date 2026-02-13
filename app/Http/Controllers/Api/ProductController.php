<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    protected $productService;

    // Inyectamos el Servicio (el cerebro)
    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    // GET /api/products
    public function index(): JsonResponse
    {
        $products = $this->productService->getCatalogItems();

        return response()->json($products);
    }

    // GET /api/products/{slug}
    public function show(string $slug): JsonResponse
    {
        try {
            $data = $this->productService->getProductDetails($slug);

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Producto no encontrado'], 404);
        }
    }
}
