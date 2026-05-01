<?php

namespace App\Http\Controllers;

use App\Domain\Products\Services\CatalogPageService;
use App\Models\Product;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogProductController extends Controller
{
    public function __construct(
        private readonly CatalogPageService $catalogPageService,
    ) {}

    /**
     * Mostrar detalles de un producto
     *
     * @param  Product  $product  - Laravel resolverá automáticamente por slug
     */
    public function show(Request $request, Product $product): Response
    {
        try {
            return Inertia::render('Catalog/ProductPage', $this->catalogPageService->getProductPageData($product->slug, $request));
        } catch (ModelNotFoundException $e) {
            abort(404, 'Producto no encontrado');
        }
    }

    /**
     * Listado de productos con filtros
     */
    public function index(Request $request): Response
    {
        return Inertia::render('Catalog/Products', $this->catalogPageService->getCatalogPageData($request));
    }
}
