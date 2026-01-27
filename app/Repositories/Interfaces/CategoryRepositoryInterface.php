<?php

namespace App\Repositories\Interfaces;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

interface CategoryRepositoryInterface
{
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

    /**
     * Obtener subcategorías de una categoría
     */
    public function getChildCategories(string $categoryId): Collection;

    /**
     * Obtener productos de una categoría (paginados)
     */
    public function getCategoryProductsPaginated(string $categoryId, int $perPage = 12);
}
