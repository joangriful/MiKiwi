<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HomeSectionImage extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'home_section_image';

    protected $fillable = [
        'image_home_id',
        'section_key',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function imageHome(): BelongsTo
    {
        return $this->belongsTo(ImageHome::class);
    }
}
