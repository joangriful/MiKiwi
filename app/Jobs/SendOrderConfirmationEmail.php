<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendOrderConfirmationEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public Order $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function handle(): void
    {
        // Enviar email de confirmación
        // Mail::to($this->order->user->email)->send(new OrderConfirmationMail($this->order));

        \Illuminate\Support\Facades\Log::info('Order confirmation email job processed', [
            'order_id' => $this->order->id,
        ]);
    }
}
