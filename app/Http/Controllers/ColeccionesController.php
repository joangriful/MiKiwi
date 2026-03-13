<?php

namespace App\Http\Controllers;

use App\Domain\Categories\Services\CategoryService;
use App\Services\ProductService;
use Inertia\Inertia;

class ColeccionesController extends Controller
{
    protected $productService;

    protected $categoryService;

    public function __construct(ProductService $productService, CategoryService $categoryService)
    {
        $this->productService = $productService;
        $this->categoryService = $categoryService;
    }

    /**
     * Mostrar el catálogo principal de productos
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Obtener productos paginados
        $products = $this->productService->getCatalogItems();

        // Obtener categorías para navegación
        $categories = $this->categoryService->getNavigationCategories();

        return Inertia::render('Colecciones/Index', [
            'products' => $products,
            'categories' => $categories,
            'pageTitle' => 'Catálogo de Productos - MiKiwi',
        ]);
    }
}
