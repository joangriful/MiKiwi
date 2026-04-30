<?php

declare(strict_types=1);

namespace App\Domain\Categories\Repositories\Eloquent;

use App\Domain\Categories\Repositories\Interfaces\CategoryRepositoryInterface;
use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentCategoryRepository implements CategoryRepositoryInterface
{
    private const ADMIN_ROOT_CATEGORY_SLUGS = [
        'para-el',
        'para-ella',
        'parejas',
        'anal',
        'salud-intima',
    ];

    public function findBySlug(string $slug): ?Category
    {
        return Category::where('slug', $slug)->first();
    }

    /**
     * Obtener categoría activa por slug
     */
    public function getActiveBySlug(string $slug): ?Category
    {
        return Category::active()
            ->where('slug', $slug)
            ->with(['products' => function ($query) {
                $query->active()->inStock();
            }])
            ->first();
    }

    /**
     * Obtener todas las categorías activas con sus productos
     */
    public function getAllActiveWithProducts(): Collection
    {
        return Category::active()
            ->with(['products' => function ($query) {
                $query->active()->inStock()->limit(8);
            }])
            ->get();
    }

    /**
     * Obtener categorías raíz (sin padre)
     */
    public function getRootCategories(): Collection
    {
        return Category::active()
            ->orderBy('name')
            ->get();
    }

    public function getAdminRootCategories(): Collection
    {
        $categories = Category::active()
            ->get(['id', 'name', 'slug', 'is_active']);

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
     * Obtener subcategorías de una categoría
     */
    public function getChildCategories(string $categoryId): Collection
    {
        return new Collection;
    }

    /**
     * Obtener productos de una categoría (paginados)
     */
    public function getCategoryProductsPaginated(string $categoryId, int $perPage = 12): ?LengthAwarePaginator
    {
        $category = Category::query()->find($categoryId);

        if (! $category) {
            return null;
        }

        return $category->products()
            ->active()
            ->inStock()
            ->with('category')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getDescendantIds(Category $category): Collection
    {
        return new Collection([$category->id]);
    }
}
