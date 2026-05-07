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
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class CatalogPageService
{
    public const ACTIVE_SIMPLE_PRODUCTS_TOTAL_CACHE_KEY = 'catalog.products.active_simple_total';

    public const CATALOG_PRODUCTS_VERSION_CACHE_KEY = 'catalog.products.version';

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
            ->simple()
            ->where('category_id', $product->category_id)
            ->whereKeyNot($product->getKey())
            ->with(['category', 'images'])
            ->when($request->user(), fn (Builder $query) => $this->withFavoriteState($query, $request))
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
        $query = Product::query()->active()->simple();

        $this->applyFilters($query, $request);
        $this->applySort($query, $request);

        return [
            'products' => $this->paginateProducts($query, $request),
            'categories' => $this->getCatalogCategories(),
            'filters' => $request->only(['category', 'subCategory', 'min_price', 'max_price', 'sort', 'search', 'featured']),
        ];
    }

    public function getCategoryPageData(string $slug): array
    {
        $category = $this->categoryService->findBySlug($slug);

        if (! $category || ! $category->is_active) {
            throw new ModelNotFoundException('Categoría no encontrada o inactiva.');
        }

        $parentCategory = $category->parent;

        return [
            'category' => $category,
            'products' => $this->categoryService->getCategoryDetails($slug)['products'],
            'categories' => $this->categoryService->getNavigationCategories(),
            'filters' => [
                'category' => $parentCategory?->getKey() ?? $category->getKey(),
                'subCategory' => $parentCategory ? $category->getKey() : null,
            ],
            'pageTitle' => $category->name.' - MiKiwi',
        ];
    }

    /**
     * @param  Builder<Product>  $query
     */
    private function applyFilters(Builder $query, Request $request): void
    {
        if ($request->filled('subCategory')) {
            $subCategory = $this->resolveCategory($request->string('subCategory')->toString());

            if ($subCategory) {
                $query->where('category_id', $subCategory->getKey());

                return;
            }
        }

        if ($request->filled('category')) {
            $category = $this->resolveCategory($request->string('category')->toString());

            if ($category) {
                $query->whereIn('category_id', $this->categoryService->getFilterCategoryIds($category)->all());
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
     * @param  Builder<Product>  $query
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
     * @param  Builder<Product>  $query
     */
    private function paginateProducts(Builder $query, Request $request): array|LengthAwarePaginator
    {
        if ($this->canCacheCatalogProducts($request)) {
            return Cache::remember(
                $this->catalogProductsCacheKey($request),
                now()->addMinutes(30),
                fn (): array => $this->buildPaginatedProducts($query, $request)->toArray()
            );
        }

        return $this->buildPaginatedProducts($query, $request);
    }

    /**
     * @param  Builder<Product>  $query
     */
    private function buildPaginatedProducts(Builder $query, Request $request): LengthAwarePaginator
    {
        $total = $this->resolveCachedTotal($query, $request);

        $products = $query
            ->select([
                'id',
                'name',
                'slug',
                'sku',
                'description',
                'base_price',
                'product_type',
                'is_promoted',
                'created_at',
            ])
            ->with([
                'images' => fn ($images) => $images
                    ->select(['id', 'product_id', 'image_url', 'alt_text', 'sort_order'])
                    ->orderBy('sort_order'),
            ])
            ->when($request->user(), fn (Builder $query) => $this->withFavoriteState($query, $request))
            ->paginate(12, ['*'], 'page', null, $total)
            ->withQueryString();
        $products->through(fn (Product $product): array => ProductResource::make($product)->resolve($request));

        return $products;
    }

    /**
     * @param  Builder<Product>  $query
     */
    private function resolveCachedTotal(Builder $query, Request $request): ?int
    {
        if ($this->hasTotalChangingFilters($request)) {
            return null;
        }

        if (app()->runningUnitTests()) {
            return (clone $query)->count();
        }

        return Cache::remember(
            self::ACTIVE_SIMPLE_PRODUCTS_TOTAL_CACHE_KEY,
            now()->addMinutes(30),
            fn (): int => (clone $query)->count()
        );
    }

    private function canCacheCatalogProducts(Request $request): bool
    {
        return ! app()->runningUnitTests()
            && ! $request->user()
            && ! $this->hasTotalChangingFilters($request);
    }

    /**
     * @param  Builder<Product>  $query
     */
    private function withFavoriteState(Builder $query, Request $request): Builder
    {
        /** @var \App\Models\User|null $user */
        $user = $request->user();

        if (! $user) {
            return $query;
        }

        return $query->withExists([
            'favoritedByUsers as is_favorite' => fn (Builder $favoriteQuery) => $favoriteQuery->whereKey($user->getKey()),
        ]);
    }

    private function catalogProductsCacheKey(Request $request): string
    {
        return 'catalog.products.page.'.md5(json_encode([
            'version' => $this->catalogProductsVersion(),
            'page' => max(1, $request->integer('page', 1)),
            'sort' => $request->input('sort', 'newest'),
        ], JSON_THROW_ON_ERROR));
    }

    private function catalogProductsVersion(): string
    {
        return Cache::rememberForever(
            self::CATALOG_PRODUCTS_VERSION_CACHE_KEY,
            fn (): string => (string) Str::uuid()
        );
    }

    private function hasTotalChangingFilters(Request $request): bool
    {
        return collect(['category', 'subCategory', 'min_price', 'max_price', 'search', 'featured'])
            ->contains(fn (string $filter): bool => $request->filled($filter) || $request->boolean($filter));
    }

    /**
     * @return Collection<int, Category>
     */
    private function getCatalogCategories(): Collection
    {
        return $this->categoryService->getNavigationCategories();
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
