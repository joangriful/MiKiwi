<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItemAccessory extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'order_item_accessory';

    protected $fillable = [
        'order_item_id',
        'product_id',
        'product_name_snapshot',
        'sku_snapshot',
        'category',
        'view',
        'unit_price',
        'quantity',
        'visual_data_snapshot',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'quantity' => 'integer',
        'visual_data_snapshot' => 'array',
    ];

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
