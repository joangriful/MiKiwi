<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\Product;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProductLowStock
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Product $product;

    public int $currentStock;

    public function __construct(Product $product, int $currentStock)
    {
        $this->product = $product;
        $this->currentStock = $currentStock;
    }
}
