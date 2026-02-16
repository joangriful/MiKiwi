<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InsufficientStockException extends Exception
{
    protected string $productName;

    protected int $availableStock;

    protected int $requestedQuantity;

    protected ?string $productIdentifier;

    public function __construct(
        string $productName,
        int $availableStock,
        int $requestedQuantity,
        ?string $productIdentifier = null,
        ?string $message = null,
        int $code = Response::HTTP_UNPROCESSABLE_ENTITY,
        ?\Throwable $previous = null
    ) {
        $this->productName = $productName;
        $this->availableStock = $availableStock;
        $this->requestedQuantity = $requestedQuantity;
        $this->productIdentifier = $productIdentifier;

        $message ??= sprintf(
            'Stock insuficiente para "%s". Disponible: %d, Solicitado: %d',
            $productName,
            $availableStock,
            $requestedQuantity
        );

        parent::__construct($message, $code, $previous);
    }

    public function getProductName(): string
    {
        return $this->productName;
    }

    public function getAvailableStock(): int
    {
        return $this->availableStock;
    }

    public function getRequestedQuantity(): int
    {
        return $this->requestedQuantity;
    }

    public function getProductIdentifier(): ?string
    {
        return $this->productIdentifier;
    }

    public function isOutOfStock(): bool
    {
        return $this->availableStock === 0;
    }

    public function getShortage(): int
    {
        return max(0, $this->requestedQuantity - $this->availableStock);
    }

    public function toArray(): array
    {
        return [
            'error' => 'insufficient_stock',
            'message' => $this->getMessage(),
            'product' => [
                'name' => $this->productName,
                'identifier' => $this->productIdentifier,
            ],
            'stock' => [
                'available' => $this->availableStock,
                'requested' => $this->requestedQuantity,
                'shortage' => $this->getShortage(),
            ],
        ];
    }

    public function render(Request $request): JsonResponse
    {
        return response()->json(
            $this->toArray(),
            $this->getCode()
        );
    }
}
