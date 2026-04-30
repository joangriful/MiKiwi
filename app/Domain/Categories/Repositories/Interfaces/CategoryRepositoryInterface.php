<?php

declare(strict_types=1);

namespace App\Domain\Categories\Repositories\Interfaces;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface CategoryRepositoryInterface
{
    public function findBySlug(string $slug): ?Category;

    /**
     * Obtener categoría activa por slug
     */
    public function getActiveBySlug(string $slug): ?Category;

    /**
     * Obtener todas las categorías activas con sus productos
     */
    public function getAllActiveWithProducts(): Collection;

    /**
     * Obtener categorías activas para navegación
     */
    public function getNavigationCategories(): Collection;

    public function getAdminRootCategories(): Collection;

    /**
     * Obtener productos de una categoría (paginados)
     */
    public function getCategoryProductsPaginated(string $categoryId, int $perPage = 12): ?LengthAwarePaginator;

    /**
     * Obtener IDs aplicables al filtrado de una categoría.
     * En el modelo actual no jerárquico, solo devuelve el ID de la categoría.
     */
    public function getFilterCategoryIds(Category $category): Collection;
}
