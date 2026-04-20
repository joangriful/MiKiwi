<?php

namespace App\Domain\Categories\Repositories\Eloquent;

use App\Models\Category;
use App\Domain\Categories\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentCategoryRepository implements CategoryRepositoryInterface
{
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

    public function getAdminRootCategories(): Collection
    {
        return Category::whereNull('parent_id')
            ->with([
                'children' => function ($query) {
                    $query->orderBy('name')->select(['id', 'parent_id', 'name']);
                },
            ])
            ->orderBy('name')
            ->get(['id', 'parent_id', 'name']);
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

    public function getDescendantIds(Category $category): Collection
    {
        $ids = collect([$category->id]);
        $children = Category::where('parent_id', $category->id)->get();

        foreach ($children as $child) {
            $ids = $ids->merge($this->getDescendantIds($child));
        }

        return $ids;
    }
}
