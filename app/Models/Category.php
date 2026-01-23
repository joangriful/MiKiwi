<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Category extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['parent_id', 'name', 'slug', 'is_active'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
