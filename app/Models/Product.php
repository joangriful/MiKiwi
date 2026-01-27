<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'sku',
        'is_active',
        'description',
        'base_price',
        'stock_quantity',
        'product_type',
        'is_adult_only',
        'images',
    ];

    protected $casts = [
        'images' => 'array', // Importante para que el JSON funcione
        'base_price' => 'decimal:2',
        'is_adult_only' => 'boolean',
        'is_active' => 'boolean',
        'stock_quantity' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInStock($query)
    {
        return $query->where('stock_quantity', '>', 0);
    }

    public function scopeAvailableForAdults($query)
    {
        return $query->where('is_adult_only', false);
    }

    /**
     * Get the category that owns the product.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the accessories for this product.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function accessories()
    {
        return $this->belongsToMany(
            Product::class,
            'product_accessories',
            'parent_product_id',
            'accessory_product_id'
        )
            ->withPivot(['is_mandatory', 'group_name'])
            ->withTimestamps();
    }

    /**
     * Get the reviews for the product.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get the order items for the product.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
