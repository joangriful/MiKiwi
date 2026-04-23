<?php

declare(strict_types=1);

namespace App\Domain\Orders\Actions;

use App\Domain\Payments\Services\StripeService;
use App\Enums\PaymentStatus;
use Illuminate\Support\Facades\Log;

class ResolveOrderPaymentStatus
{
    public function __construct(
        private readonly StripeService $stripeService,
    ) {}

    public function execute(?string $paymentIntentId): string
    {
        if ($paymentIntentId === null || $paymentIntentId === '') {
            return PaymentStatus::Pending->value;
        }

        try {
            $intent = $this->stripeService->getPaymentIntent($paymentIntentId);

            return $intent->status === 'succeeded'
                ? PaymentStatus::Paid->value
                : PaymentStatus::Pending->value;
        } catch (\Throwable $exception) {
            Log::error('Stripe reveal error: '.$exception->getMessage());

            return PaymentStatus::Pending->value;
        }
    }
}
