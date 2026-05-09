<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coupon extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'coupon';

    protected $fillable = [
        'code',
        'type',
        'value',
        'minimum_amount',
        'first_order_only',
        'required_product_type',
        'is_active',
        'expires_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'first_order_only' => 'boolean',
        'expires_at' => 'datetime',
        'value' => 'decimal:2',
        'minimum_amount' => 'decimal:2',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'coupon_id');
    }
}
