<?php

namespace App\Domain\Categories\Services;

use App\Domain\Categories\Repositories\Interfaces\CategoryRepositoryInterface;
use App\Models\Category;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CategoryService
{
    protected $categoryRepository;

    public function __construct(CategoryRepositoryInterface $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    /**
     * Obtener todas las categorías activas con productos
     */
    public function getAllCategoriesWithProducts()
    {
        return $this->categoryRepository->getAllActiveWithProducts();
    }

    /**
     * Obtener categorías raíz para navegación
     */
    public function getNavigationCategories()
    {
        return $this->categoryRepository->getRootCategories();
    }

    public function getAdminAssignableCategories()
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
        $products = $this->categoryRepository->getCategoryProductsPaginated($category->id, 12);

        // Obtener subcategorías si existen
        $subcategories = $this->categoryRepository->getChildCategories($category->id);

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

    public function getDescendantIds(Category $category)
    {
        return $this->categoryRepository->getDescendantIds($category);
    }

    /**
     * Construir breadcrumbs para navegación
     */
    protected function buildBreadcrumbs($category): array
    {
        $breadcrumbs = [];
        $current = $category;

        while ($current) {
            array_unshift($breadcrumbs, [
                'name' => $current->name,
                'slug' => $current->slug,
                'url' => route('categories.show', $current->slug),
            ]);
            $current = $current->parent;
        }

        return $breadcrumbs;
    }
}
