<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProductNotFoundException extends Exception
{
    protected ?string $productSlug;

    public function __construct(
        ?string $productSlug = null,
        ?string $message = null,
        int $code = Response::HTTP_NOT_FOUND,
        ?\Throwable $previous = null
    ) {
        $this->productSlug = $productSlug;
        $message ??= $productSlug
            ? "Producto '{$productSlug}' no encontrado o inactivo."
            : 'Producto no encontrado.';

        parent::__construct($message, $code, $previous);
    }

    public function getProductSlug(): ?string
    {
        return $this->productSlug;
    }

    public function render(Request $request): JsonResponse
    {
        return response()->json([
            'error' => 'product_not_found',
            'message' => $this->getMessage(),
            'slug' => $this->productSlug,
        ], $this->getCode());
    }
}
