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

            return Inertia::render('ProductPage', [
                'product' => $productData['product'],
                'accessories' => $productData['accessories'],
                'relatedProducts' => $relatedProducts,
                'pageTitle' => $product->name . ' - MiKiwi',
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

        // Filtrar por categoría (ID o Slug, Incluyendo subcategorías de forma recursiva)
        if ($request->has('category')) {
            $categoryParam = $request->query('category');

            $category = \App\Models\Category::where('id', $categoryParam)
                ->orWhere('slug', $categoryParam)
                ->first();

            if ($category) {
                // Get all children IDs for this category
                $categoryIds = \App\Models\Category::where('id', $category->id)
                    ->orWhere('parent_id', $category->id)
                    ->pluck('id');

                $query->whereIn('category_id', $categoryIds);
            }
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

        // Filtrar por nombre (Búsqueda)
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Filtrar por productos destacados (Top Ventas)
        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
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

        // Obtener categorías con sus hijos para el sidebar
        $categories = \App\Models\Category::root()
            ->where('is_active', true)
            ->with([
                'children' => function ($q) {
                    $q->where('is_active', true)
                        ->withCount([
                            'products' => function ($query) {
                                $query->where('is_active', true)->where('stock_quantity', '>', 0);
                            }
                        ])
                        ->orderBy('name');
                }
            ])
            ->withCount([
                'products' => function ($query) {
                    $query->where('is_active', true)->where('stock_quantity', '>', 0);
                }
            ])
            ->orderBy('name')
            ->get();

        // Calcular el total de productos de la categoría principal sumando también los de sus subcategorías
        $categories->each(function ($category) {
            $childrenCount = $category->children->sum('products_count');
            $category->total_products_count = $category->products_count + $childrenCount;
        });

        return Inertia::render('Products', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['category', 'subCategory', 'min_price', 'max_price', 'sort', 'search', 'featured']),
        ]);
    }
}
