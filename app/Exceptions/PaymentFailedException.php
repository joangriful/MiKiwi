<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PaymentFailedException extends Exception
{
    protected string $paymentMethod;

    protected ?string $transactionId;

    protected array $errorDetails;

    public function __construct(
        string $paymentMethod,
        ?string $transactionId = null,
        array $errorDetails = [],
        ?string $message = null,
        int $code = Response::HTTP_PAYMENT_REQUIRED,
        ?\Throwable $previous = null
    ) {
        $this->paymentMethod = $paymentMethod;
        $this->transactionId = $transactionId;
        $this->errorDetails = $errorDetails;
        $message ??= 'El pago no pudo ser procesado. Por favor, intenta nuevamente.';

        parent::__construct($message, $code, $previous);
    }

    public function getPaymentMethod(): string
    {
        return $this->paymentMethod;
    }

    public function getTransactionId(): ?string
    {
        return $this->transactionId;
    }

    public function getErrorDetails(): array
    {
        return $this->errorDetails;
    }

    public function render(Request $request): JsonResponse
    {
        return response()->json([
            'error' => 'payment_failed',
            'message' => $this->getMessage(),
            'payment_method' => $this->paymentMethod,
            'transaction_id' => $this->transactionId,
            'details' => $this->errorDetails,
        ], $this->getCode());
    }
}
