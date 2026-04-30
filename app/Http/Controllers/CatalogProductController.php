<?php

namespace App\Http\Controllers;

use App\Domain\Products\Services\ProductService;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use App\Support\Database\CaseInsensitiveSearch;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection as SupportCollection;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CatalogProductController extends Controller
{
    public function __construct(
        private readonly ProductService $productService,
    ) {}

    /**
     * Mostrar detalles de un producto
     *
     * @param  Product  $product  - Laravel resolverá automáticamente por slug
     */
    public function show(Request $request, Product $product): Response
    {
        try {
            // Usar el servicio para obtener detalles completos del producto
            $productData = $this->productService->getProductDetails($product->slug);

            // Obtener productos relacionados de la misma categoría
            $relatedProducts = Product::where('category_id', $product->category_id)
                ->where('id', '!=', $product->id)
                ->where('is_active', true)
                ->with(['category', 'images'])
                ->inRandomOrder()
                ->take(4)
                ->get();

            return Inertia::render('Catalog/ProductPage', [
                'product' => ProductResource::make($productData['product'])->resolve($request),
                'accessories' => ProductResource::collection($productData['accessories'])->resolve($request),
                'relatedProducts' => ProductResource::collection($relatedProducts)->resolve($request),
                'pageTitle' => $product->name.' - MiKiwi',
            ]);
        } catch (ModelNotFoundException $e) {
            abort(404, 'Producto no encontrado');
        }
    }

    /**
     * Listado de productos con filtros
     */
    public function index(Request $request): Response
    {
        $query = Product::query()->where('is_active', true);

        $this->applyCatalogFilters($query, $request);
        $this->applyCatalogSort($query, $request);

        return Inertia::render('Catalog/Products', [
            'products' => $this->paginatedPublicProducts($query, $request),
            'categories' => $this->catalogCategories(),
            'filters' => $request->only(['category', 'subCategory', 'min_price', 'max_price', 'sort', 'search', 'featured']),
        ]);
    }

    /**
     * @param  Builder<Product>  $query
     */
    private function applyCatalogFilters(Builder $query, Request $request): void
    {
        // Filtrar por categoría (ID o slug)
        if ($request->has('category')) {
            $categoryParam = $request->query('category');

            $categoryQuery = Category::query();

            if (Str::isUuid($categoryParam)) {
                $categoryQuery->where('id', $categoryParam);
            } else {
                $categoryQuery->where('slug', $categoryParam);
            }

            $category = $categoryQuery->first();

            if ($category) {
                if ($category->slug === 'parejas') {
                    $bdsmCategory = Category::query()->where('slug', 'bdsm-y-fetiche')->first();
                    if ($bdsmCategory) {
                        $bdsmIds = $this->getCategoryAndDescendants($bdsmCategory);
                        $query->whereNotIn('category_id', $bdsmIds);
                    }
                } else {
                    $categoryIds = $this->getCategoryAndDescendants($category);
                    $query->whereIn('category_id', $categoryIds);
                }
            }
        }

        // Filtrar por subcategoría específica
        if ($request->has('subCategory')) {
            $subCategoryParam = $request->subCategory;

            $subCategory = Category::query()
                ->when(
                    Str::isUuid($subCategoryParam),
                    fn ($query) => $query->where('id', $subCategoryParam),
                    fn ($query) => $query->where('name', $subCategoryParam)->orWhere('slug', $subCategoryParam)
                )
                ->first();

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
            CaseInsensitiveSearch::contains($query, 'name', $request->string('search')->toString());
        }

        // Filtrar por productos destacados
        if ($request->boolean('featured')) {
            $query->where('is_promoted', true);
        }
    }

    /**
     * @param  Builder<Product>  $query
     */
    private function applyCatalogSort(Builder $query, Request $request): void
    {
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
    }

    /**
     * @param  Builder<Product>  $query
     */
    private function paginatedPublicProducts(Builder $query, Request $request): LengthAwarePaginator
    {
        $products = $query->with(['category', 'images'])->paginate(12)->withQueryString();
        $products->through(fn (Product $product): array => ProductResource::make($product)->resolve($request));

        return $products;
    }

    /**
     * @return Collection<int, Category>
     */
    private function catalogCategories(): Collection
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->withCount([
                'products' => function ($query) {
                    $query->where('is_active', true)->where('stock_quantity', '>', 0);
                },
            ])
            ->orderBy('name')
            ->get();

        $categories->each(function ($category) {
            $category->total_products_count = $category->products_count;
        });

        return $categories;
    }

    /**
     * Get category filter scope IDs.
     *
     * @return SupportCollection<int, string>
     */
    private function getCategoryAndDescendants(Category $category): SupportCollection
    {
        return collect([$category->id]);
    }
}
