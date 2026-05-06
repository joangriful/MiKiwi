<?php

declare(strict_types=1);

namespace App\Domain\Categories\Repositories\Eloquent;

use App\Domain\Categories\Repositories\Interfaces\CategoryRepositoryInterface;
use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class EloquentCategoryRepository implements CategoryRepositoryInterface
{
    public const NAVIGATION_CATEGORIES_CACHE_KEY = 'catalog.navigation_categories';

    private const ADMIN_ROOT_CATEGORY_SLUGS = [
        'estimulacion-externa',
        'estimulacion-interna',
        'pene-y-testiculos',
        'estimulacion-anal',
        'bdsm-y-fetiche',
        'cosmetica-y-cuidado',
    ];

    public function findBySlug(string $slug): ?Category
    {
        return Category::query()
            ->with(['parent', 'children'])
            ->where('slug', $slug)
            ->first();
    }

    /**
     * Obtener categoría activa por slug
     */
    public function getActiveBySlug(string $slug): ?Category
    {
        return Category::active()
            ->where('slug', $slug)
            ->with([
                'parent',
                'children' => fn ($query) => $query->active()->orderBy('name'),
                'products' => fn ($query) => $query->active()->simple()->inStock(),
            ])
            ->first();
    }

    /**
     * Obtener todas las categorías activas con sus productos
     */
    public function getAllActiveWithProducts(): Collection
    {
        return Category::active()
            ->root()
            ->with([
                'products' => fn ($query) => $query->active()->simple()->inStock()->limit(8),
                'children' => fn ($query) => $query->active()->orderBy('name')->with([
                    'products' => fn ($childProducts) => $childProducts->active()->simple()->inStock()->limit(8),
                ]),
            ])
            ->orderBy('name')
            ->get();
    }

    /**
     * Obtener categorías activas para navegación
     */
    public function getNavigationCategories(): Collection
    {
        if (app()->runningUnitTests()) {
            return $this->buildNavigationCategories();
        }

        return Cache::remember(
            self::NAVIGATION_CATEGORIES_CACHE_KEY,
            now()->addMinutes(30),
            fn (): Collection => $this->buildNavigationCategories()
        );
    }

    private function buildNavigationCategories(): Collection
    {
        return Category::active()
            ->root()
            ->with([
                'children' => fn ($query) => $query->active()
                    ->withCount([
                        'products' => fn ($products) => $products->active()->simple()->inStock(),
                    ])
                    ->orderBy('name'),
            ])
            ->withCount([
                'products' => fn ($query) => $query->active()->simple()->inStock(),
            ])
            ->orderBy('name')
            ->get()
            ->each(function (Category $category): void {
                $childrenCount = $category->children->sum('products_count');
                $category->setAttribute('total_products_count', $category->products_count + $childrenCount);
            });
    }

    public function getAdminRootCategories(): Collection
    {
        $categories = Category::active()
            ->root()
            ->with([
                'children' => fn ($query) => $query->active()
                    ->orderBy('name')
                    ->select(['id', 'parent_id', 'name', 'slug', 'is_active']),
            ])
            ->get(['id', 'parent_id', 'name', 'slug', 'is_active']);

        $preferredCategories = $categories
            ->whereIn('slug', self::ADMIN_ROOT_CATEGORY_SLUGS)
            ->sortBy(fn (Category $category) => array_search($category->slug, self::ADMIN_ROOT_CATEGORY_SLUGS, true))
            ->values();

        if ($preferredCategories->isNotEmpty()) {
            return new Collection($preferredCategories->all());
        }

        return $categories->sortBy('name')->values();
    }

    /**
     * Obtener productos de una categoría (paginados)
     */
    public function getCategoryProductsPaginated(string $categoryId, int $perPage = 12): ?LengthAwarePaginator
    {
        $category = Category::query()
            ->with('children:id,parent_id')
            ->find($categoryId);

        if (! $category) {
            return null;
        }

        $categoryIds = $this->getFilterCategoryIds($category)->all();

        return \App\Models\Product::query()
            ->active()
            ->simple()
            ->whereIn('category_id', $categoryIds)
            ->inStock()
            ->with('category')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getFilterCategoryIds(Category $category): Collection
    {
        $category->loadMissing('children:id,parent_id');

        return new Collection([
            $category->id,
            ...$category->children->pluck('id')->all(),
        ]);
    }
}
