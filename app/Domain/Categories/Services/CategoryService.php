<?php

declare(strict_types=1);

namespace App\Domain\Categories\Services;

use App\Domain\Categories\Repositories\Interfaces\CategoryRepositoryInterface;
use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Pagination\LengthAwarePaginator;

class CategoryService
{
    public function __construct(
        private readonly CategoryRepositoryInterface $categoryRepository,
    ) {}

    /**
     * Obtener todas las categorías activas con productos
     */
    public function getAllCategoriesWithProducts(): Collection
    {
        return $this->categoryRepository->getAllActiveWithProducts();
    }

    /**
     * Obtener categorías raíz para navegación
     */
    public function getNavigationCategories(): Collection
    {
        return $this->categoryRepository->getRootCategories();
    }

    public function getAdminAssignableCategories(): Collection
    {
        return $this->categoryRepository->getAdminRootCategories();
    }

    /**
     * Obtener detalles de una categoría con sus productos
     */
    public function getCategoryDetails(string $slug): array
    {
        $category = $this->categoryRepository->getActiveBySlug($slug);

        if (! $category) {
            throw new ModelNotFoundException('Categoría no encontrada o inactiva.');
        }

        // Obtener productos paginados de la categoría
        $products = $this->categoryRepository->getCategoryProductsPaginated((string) $category->id, 12);

        // Obtener subcategorías si existen
        $subcategories = $this->categoryRepository->getChildCategories((string) $category->id);

        return [
            'category' => $category,
            'products' => $products,
            'subcategories' => $subcategories,
            'breadcrumbs' => $this->buildBreadcrumbs($category),
        ];
    }

    public function findBySlug(string $slug): ?Category
    {
        return $this->categoryRepository->findBySlug($slug);
    }

    public function getDescendantIds(Category $category): Collection
    {
        return $this->categoryRepository->getDescendantIds($category);
    }

    /**
     * Construir breadcrumbs para navegación
     */
    protected function buildBreadcrumbs(Category $category): array
    {
        return [[
            'name' => $category->name,
            'slug' => $category->slug,
            'url' => route('categories.show', $category->slug),
        ]];
    }
}
