<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\ProductService;
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
     * @param  Product  $product  - Laravel resolverá automáticamente por slug
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
                ->with('category') // Eager load category
                ->inRandomOrder()
                ->take(4)
                ->get();

            return Inertia::render('Product/Show', [
                'product' => $productData['product'],
                'accessories' => $productData['accessories'],
                'relatedProducts' => $relatedProducts,
                'pageTitle' => $product->name.' - MiKiwi',
            ]);
        } catch (ModelNotFoundException $e) {
            abort(404, 'Producto no encontrado');
        }
    }
    /**
     * Listado de productos con filtros
     */
    public function index(\Illuminate\Http\Request $request)
    {
        $query = Product::where('is_active', true);

        // Filtrar por categoría
        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }

        // Filtrar por rango de precio
        if ($request->has('min_price')) {
            $query->where('base_price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('base_price', '<=', $request->max_price);
        }

        // Ordenar
        $sort = $request->input('sort', 'newest');
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('base_price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('base_price', 'desc');
                break;
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            default: // newest
                $query->orderBy('created_at', 'desc');
                break;
        }

        $products = $query->paginate(12)->withQueryString();

        // Obtener categorías para el sidebar (Cached)
        $categories = \Illuminate\Support\Facades\Cache::remember('sidebar_categories', 3600, function () {
            return \App\Models\Category::where('is_active', true)->orderBy('name')->get();
        });

        return Inertia::render('Products', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['category', 'min_price', 'max_price', 'sort']),
        ]);
    }
}
