<?php

namespace App\Http\Controllers;

use App\Services\CategoryService;
use App\Models\Category;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Inertia\Inertia;

class CategoryController extends Controller
{
    protected $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * Mostrar productos de una categoría específica
     * 
     * @param Category $category - Laravel resolverá automáticamente por slug
     * @return \Inertia\Response
     */
    public function show(Category $category)
    {
        try {
            // Obtener detalles de la categoría con productos
            $categoryData = $this->categoryService->getCategoryDetails($category->slug);

            return Inertia::render('Category/Show', [
                'category' => $categoryData['category'],
                'products' => $categoryData['products'],
                'subcategories' => $categoryData['subcategories'],
                'breadcrumbs' => $categoryData['breadcrumbs'],
                'pageTitle' => $category->name . ' - MiKiwi'
            ]);
        } catch (ModelNotFoundException $e) {
            abort(404, 'Categoría no encontrada');
        }
    }
}
