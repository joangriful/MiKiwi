<?php

declare(strict_types=1);

namespace App\Domain\Products\Services;

use App\Domain\Categories\Services\CategoryService;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use App\Support\Database\CaseInsensitiveSearch;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class CatalogPageService
{
    public function __construct(
        private readonly ProductService $productService,
        private readonly CategoryService $categoryService,
    ) {}

    public function getProductPageData(string $slug, Request $request): array
    {
        $productData = $this->productService->getProductDetails($slug);
        $product = $productData['product'];

        $relatedProducts = Product::query()
            ->active()
            ->where('category_id', $product->category_id)
            ->whereKeyNot($product->getKey())
            ->with(['category', 'images'])
            ->inRandomOrder()
            ->limit(4)
            ->get();

        return [
            'product' => ProductResource::make($product)->resolve($request),
            'accessories' => ProductResource::collection($productData['accessories'])->resolve($request),
            'relatedProducts' => ProductResource::collection($relatedProducts)->resolve($request),
            'pageTitle' => $product->name.' - MiKiwi',
        ];
    }

    public function getCatalogPageData(Request $request): array
    {
        $query = Product::query()->active();

        $this->applyFilters($query, $request);
        $this->applySort($query, $request);

        return [
            'products' => $this->paginateProducts($query, $request),
            'categories' => $this->getCatalogCategories(),
            'filters' => $request->only(['category', 'min_price', 'max_price', 'sort', 'search', 'featured']),
        ];
    }

    public function getCategoryPageData(string $slug): array
    {
        $category = $this->categoryService->findBySlug($slug);

        if (! $category || ! $category->is_active) {
            throw new ModelNotFoundException('Categoría no encontrada o inactiva.');
        }

        return [
            'category' => $category,
            'products' => $this->categoryService->getCategoryDetails($slug)['products'],
            'categories' => $this->categoryService->getNavigationCategories(),
            'filters' => ['category' => $category->id],
            'pageTitle' => $category->name.' - MiKiwi',
        ];
    }

    /**
     * @param Builder<Product> $query
     */
    private function applyFilters(Builder $query, Request $request): void
    {
        if ($request->filled('category')) {
            $category = $this->resolveCategory($request->string('category')->toString());

            if ($category) {
                $query->where('category_id', $category->getKey());
            }
        }

        if ($request->has('min_price')) {
            $query->where('base_price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('base_price', '<=', $request->max_price);
        }

        if ($request->filled('search')) {
            CaseInsensitiveSearch::contains($query, 'name', $request->string('search')->toString());
        }

        if ($request->boolean('featured')) {
            $query->where('is_promoted', true);
        }
    }

    /**
     * @param Builder<Product> $query
     */
    private function applySort(Builder $query, Request $request): void
    {
        match ($request->input('sort', 'newest')) {
            'price_asc' => $query->orderBy('base_price', 'asc'),
            'price_desc' => $query->orderBy('base_price', 'desc'),
            'name_asc' => $query->orderBy('name', 'asc'),
            default => $query->orderBy('created_at', 'desc'),
        };
    }

    /**
     * @param Builder<Product> $query
     */
    private function paginateProducts(Builder $query, Request $request): LengthAwarePaginator
    {
        $products = $query->with(['category', 'images'])->paginate(12)->withQueryString();
        $products->through(fn (Product $product): array => ProductResource::make($product)->resolve($request));

        return $products;
    }

    /**
     * @return Collection<int, Category>
     */
    private function getCatalogCategories(): Collection
    {
        $categories = Category::query()
            ->active()
            ->withCount([
                'products' => fn ($query) => $query->active()->inStock(),
            ])
            ->orderBy('name')
            ->get();

        $categories->each(function (Category $category): void {
            $category->total_products_count = $category->products_count;
        });

        return $categories;
    }

    private function resolveCategory(string $categoryParam): ?Category
    {
        $query = Category::query();

        if (Str::isUuid($categoryParam)) {
            return $query->whereKey($categoryParam)->first();
        }

        return $query->where('slug', $categoryParam)->first();
    }
}
