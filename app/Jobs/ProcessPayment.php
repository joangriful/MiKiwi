<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessPayment implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public Order $order;

    public string $paymentMethod;

    public array $paymentData;

    public function __construct(Order $order, string $paymentMethod, array $paymentData = [])
    {
        $this->order = $order;
        $this->paymentMethod = $paymentMethod;
        $this->paymentData = $paymentData;
    }

    public function handle(): void
    {
        // Procesar pago según el método
        // Stripe, PayPal, transferencia, etc.

        \Illuminate\Support\Facades\Log::info('Payment processed', [
            'order_id' => $this->order->id,
            'payment_method' => $this->paymentMethod,
        ]);
    }
}
