<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InvalidOrderException extends Exception
{
    protected string $reason;

    protected ?string $orderNumber;

    public function __construct(
        string $reason,
        ?string $orderNumber = null,
        ?string $message = null,
        int $code = Response::HTTP_UNPROCESSABLE_ENTITY,
        ?\Throwable $previous = null
    ) {
        $this->reason = $reason;
        $this->orderNumber = $orderNumber;
        $message ??= match ($reason) {
            'not_found' => 'Pedido no encontrado.',
            'invalid_status' => 'Estado de pedido inválido.',
            'already_processed' => 'El pedido ya ha sido procesado y no puede modificarse.',
            'cannot_cancel' => 'El pedido no puede ser cancelado en su estado actual.',
            default => 'Error en el procesamiento del pedido.',
        };

        parent::__construct($message, $code, $previous);
    }

    public function getReason(): string
    {
        return $this->reason;
    }

    public function getOrderNumber(): ?string
    {
        return $this->orderNumber;
    }

    public function render(Request $request): JsonResponse
    {
        return response()->json([
            'error' => 'invalid_order',
            'reason' => $this->reason,
            'message' => $this->getMessage(),
            'order_number' => $this->orderNumber,
        ], $this->getCode());
    }
}
