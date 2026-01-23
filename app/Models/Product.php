<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Product extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'sku',
        'description',
        'base_price',
        'stock_quantity',
        'product_type',
        'is_adult_only',
        'images'
    ];

    protected $casts = [
        'images' => 'array', // Importante para que el JSON funcione
        'base_price' => 'decimal:2',
        'is_adult_only' => 'boolean'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
