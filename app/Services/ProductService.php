<?php

namespace App\Services;

use App\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProductService
{
    protected $productRepository;

    public function __construct(ProductRepositoryInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function getCatalogItems()
    {
        // Simplemente pedimos la lista paginada
        return $this->productRepository->getAllActivePaginated(12);
    }

    public function getProductDetails(string $slug): array
    {
        $product = $this->productRepository->getActiveBySlug($slug);

        if (! $product) {
            throw new ModelNotFoundException('Producto no encontrado o inactivo.');
        }

        // Aquí podríamos añadir lógica extra.
        // Por ejemplo, verificar si el usuario es adulto para ver productos +18.
        // Pero por ahora devolvemos el producto y sus accesorios limpios.

        return [
            'product' => $product,
            // Los accesorios ya vienen cargados por el repositorio,
            // pero si queremos asegurarnos o filtrarlos, lo hacemos aquí.
            'accessories' => $product->accessories,
        ];
    }
}
