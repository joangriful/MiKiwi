<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PickupPoint extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'pickup_point';

    protected $fillable = [
        'name',
        'address',
        'city',
        'postal_code',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function shipments(): HasMany
    {
        return $this->hasMany(Shipment::class);
    }
}
