<?php

namespace App\Repositories\Eloquent;

use App\Models\Product;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductRepository implements ProductRepositoryInterface
{
    public function getActiveBySlug(string $slug): ?Product
    {
        // Usamos el scope 'active()' del modelo de Miguel
        return Product::active()
            ->where('slug', $slug)
            ->with(['category', 'accessories', 'reviews']) // Cargamos relaciones útiles
            ->first();
    }

    public function getAccessories(string $productId): Collection
    {
        $product = Product::find($productId);

        // Gracias a que Miguel puso 'withPivot' en el modelo,
        // esto traerá también si es obligatorio ('is_mandatory')
        return $product ? $product->accessories : new Collection;
    }

    public function getAllActivePaginated(int $perPage = 12): LengthAwarePaginator
    {
        // Combinamos los scopes de Miguel: Activo + Con Stock
        return Product::active()
            ->inStock()
            ->with('category') // Eager loading para no saturar la BD
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }
}
