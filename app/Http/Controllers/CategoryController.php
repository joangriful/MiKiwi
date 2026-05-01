<?php

namespace App\Http\Controllers;

use App\Domain\Products\Services\CatalogPageService;
use App\Models\Category;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function __construct(
        private readonly CatalogPageService $catalogPageService,
    ) {}

    /**
     * Mostrar productos de una categoría específica
     *
     * @param  Category  $category  - Laravel resolverá automáticamente por slug
     * @return \Inertia\Response
     */
    public function show(Category $category)
    {
        try {
            return Inertia::render('Catalog/Products', $this->catalogPageService->getCategoryPageData($category->slug));
        } catch (ModelNotFoundException $e) {
            abort(404, 'Categoría no encontrada');
        }
    }
}
