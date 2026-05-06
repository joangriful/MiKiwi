<?php

namespace App\Models;

use App\Enums\ProductType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'product';

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'sku',
        'description',
        'base_price',
        'is_active',
        'is_promoted',
        'stock_quantity',
        'product_type',
        'is_adult_only',
    ];

    protected $casts = [
        'base_price' => 'decimal:2',
        'is_active' => 'boolean',
        'is_promoted' => 'boolean',
        'stock_quantity' => 'integer',
        'is_adult_only' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInStock($query)
    {
        return $query->where('stock_quantity', '>', 0);
    }

    public function scopeSimple($query)
    {
        return $query->where('product_type', ProductType::Simple->value);
    }

    public function scopeAvailableForAdults($query)
    {
        return $query->where('is_adult_only', false);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function collections(): BelongsToMany
    {
        return $this->belongsToMany(
            Collection::class,
            'collection_product',
            'product_id',
            'collection_id'
        )->withTimestamps();
    }

    public function accessories(): BelongsToMany
    {
        return $this->belongsToMany(
            Product::class,
            'doll_product_accessory',
            'doll_product_id',
            'accessory_product_id'
        )
            ->withPivot(['is_mandatory', 'group_name'])
            ->withTimestamps();
    }

    public function dolls(): BelongsToMany
    {
        return $this->belongsToMany(
            Product::class,
            'doll_product_accessory',
            'accessory_product_id',
            'doll_product_id'
        )
            ->withPivot(['is_mandatory', 'group_name'])
            ->withTimestamps();
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function orderItemAccessories(): HasMany
    {
        return $this->hasMany(OrderItemAccessory::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function claims(): HasMany
    {
        return $this->hasMany(Claim::class);
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
