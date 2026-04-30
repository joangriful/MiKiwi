<?php

namespace App\Models;

use App\Enums\CouponType;
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
        'is_active',
        'expires_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'expires_at' => 'datetime',
        'value' => 'decimal:2',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'coupon_id');
    }

    public function isValid(): bool
    {
        if (! $this->is_active) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        return true;
    }

    public function calculateDiscount(float $subtotal): float
    {
        if ($this->type === CouponType::Percent->value) {
            return ($subtotal * $this->value) / 100;
        }

        return min($this->value, $subtotal);
    }
}
