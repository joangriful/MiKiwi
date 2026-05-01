<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductImageZone extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'product_image_zone';

    protected $fillable = [
        'product_image_id',
        'zone_type',
    ];

    public function productImage(): BelongsTo
    {
        return $this->belongsTo(ProductImage::class);
    }
}
