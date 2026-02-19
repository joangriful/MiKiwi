<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Cache;
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
            $relatedProducts = Cache::remember("related_products_{$product->id}", 900, function () use ($product) {
                return Product::where('category_id', $product->category_id)
                    ->where('id', '!=', $product->id)
                    ->where('is_active', true)
                    ->select(['id', 'slug', 'name', 'description', 'base_price', 'image_url', 'hover_image_url'])
                    ->orderByDesc('created_at')
                    ->take(4)
                    ->get();
            });

            return Inertia::render('ProductPage', [
                'product' => $productData['product'],
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
        $query = Product::where('is_active', true)
            ->select(['id', 'slug', 'name', 'description', 'base_price', 'image_url', 'hover_image_url']);

        // Filtrar por categoría (Incluyendo subcategorías de forma recursiva)
        if ($request->has('category')) {
            $categoryIds = \App\Models\Category::where('id', $request->category)
                ->orWhere('parent_id', $request->category)
                ->pluck('id');

            $query->whereIn('category_id', $categoryIds);
        }

        // Filtrar por subcategoría específica
        if ($request->has('subCategory')) {
            $subCategory = \App\Models\Category::where('name', $request->subCategory)->first();
            if ($subCategory) {
                $query->where('category_id', $subCategory->id);
            }
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

        return Inertia::render('Products', [
            'products' => fn () => $query->paginate(12)->withQueryString(),
            'categories' => fn () => Cache::remember('products_sidebar_categories', 900, function () {
                return \App\Models\Category::root()
                    ->where('is_active', true)
                    ->with(['children' => function ($q) {
                        $q->where('is_active', true)->orderBy('name');
                    }])
                    ->orderBy('name')
                    ->get();
            }),
            'filters' => $request->only(['category', 'subCategory', 'min_price', 'max_price', 'sort']),
        ]);
    }
}
