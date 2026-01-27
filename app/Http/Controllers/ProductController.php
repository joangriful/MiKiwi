<?php

namespace App\Http\Controllers;

use App\Services\ProductService;
use App\Models\Product;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Inertia\Inertia;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Mostrar detalles de un producto
     * 
     * @param Product $product - Laravel resolverá automáticamente por slug
     * @return \Inertia\Response
     */
    public function show(Product $product)
    {
        try {
            // Usar el servicio para obtener detalles completos del producto
            $productData = $this->productService->getProductDetails($product->slug);

            // Obtener productos relacionados de la misma categoría
            $relatedProducts = Product::where('category_id', $product->category_id)
                ->where('id', '!=', $product->id)
                ->where('is_active', true)
                ->inRandomOrder()
                ->take(4)
                ->get();

            return Inertia::render('Product/Show', [
                'product' => $productData['product'],
                'accessories' => $productData['accessories'],
                'relatedProducts' => $relatedProducts,
                'pageTitle' => $product->name . ' - MiKiwi'
            ]);
        } catch (ModelNotFoundException $e) {
            abort(404, 'Producto no encontrado');
        }
    }
}
