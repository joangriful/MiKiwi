<?php

declare(strict_types=1);

namespace App\Domain\Orders\Actions;

use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Symfony\Component\HttpFoundation\Response;

class GenerateOrderInvoice
{
    public function execute(Order $order): Response
    {
        $order->load(['items.product', 'billingAddress', 'user']);

        $pdf = Pdf::loadView('invoices.order', ['order' => $order]);

        return $pdf->download($this->filename($order));
    }

    private function filename(Order $order): string
    {
        return 'factura-'.$order->order_number.'.pdf';
    }
}
