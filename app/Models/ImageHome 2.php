<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ImageHome extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'image_home';

    protected $fillable = [
        'public_id',
        'url',
        'type',
        'width',
        'height',
    ];

    protected $casts = [
        'width' => 'integer',
        'height' => 'integer',
    ];

    public function homeSectionImages(): HasMany
    {
        return $this->hasMany(HomeSectionImage::class);
    }
}
