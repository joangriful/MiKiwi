<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DollProductAccessory extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'doll_product_accessory';

    protected $fillable = [
        'doll_product_id',
        'accessory_product_id',
        'is_mandatory',
        'group_name',
    ];

    protected $casts = [
        'is_mandatory' => 'boolean',
    ];

    public function dollProduct(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'doll_product_id');
    }

    public function accessoryProduct(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'accessory_product_id');
    }
}
