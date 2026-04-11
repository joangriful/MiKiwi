<?php

namespace App\Domain\Categories\Repositories\Eloquent;

use App\Models\Category;
use App\Domain\Categories\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentCategoryRepository implements CategoryRepositoryInterface
{
    /**
     * Obtener categoría activa por slug
     */
    public function getActiveBySlug(string $slug): ?Category
    {
        return Category::active()
            ->where('slug', $slug)
            ->with(['products' => function ($query) {
                $query->active()->inStock();
            }, 'children'])
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
            ->root()
            ->with('children')
            ->get();
    }

    /**
     * Obtener subcategorías de una categoría
     */
    public function getChildCategories(string $categoryId): Collection
    {
        $category = Category::find($categoryId);

        return $category ? $category->children()->active()->get() : new Collection;
    }

    /**
     * Obtener productos de una categoría (paginados)
     */
    public function getCategoryProductsPaginated(string $categoryId, int $perPage = 12)
    {
        $category = Category::find($categoryId);

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
}
