<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CartEmptyException extends Exception
{
    protected string $context;

    public function __construct(
        string $context = 'checkout',
        ?string $message = null,
        int $code = Response::HTTP_UNPROCESSABLE_ENTITY,
        ?\Throwable $previous = null
    ) {
        $this->context = $context;

        $message ??= match ($context) {
            'checkout' => 'No puedes realizar el checkout con el carrito vacío.',
            'payment' => 'No se puede procesar el pago. El carrito está vacío.',
            'operation' => 'No se puede realizar esta operación. El carrito está vacío.',
            default => 'El carrito está vacío.',
        };

        parent::__construct($message, $code, $previous);
    }

    public function getContext(): string
    {
        return $this->context;
    }

    public function toArray(): array
    {
        return [
            'error' => 'cart_empty',
            'message' => $this->getMessage(),
            'context' => $this->context,
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
