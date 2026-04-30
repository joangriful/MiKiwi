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
     * Obtener categorías raíz (sin padre)
     */
    public function getRootCategories(): Collection;

    public function getAdminRootCategories(): Collection;

    /**
     * Obtener subcategorías de una categoría
     */
    public function getChildCategories(string $categoryId): Collection;

    /**
     * Obtener productos de una categoría (paginados)
     */
    public function getCategoryProductsPaginated(string $categoryId, int $perPage = 12): ?LengthAwarePaginator;

    public function getDescendantIds(Category $category): Collection;
}
