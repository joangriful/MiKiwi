<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroImage extends Model
{
    protected $fillable = [
        'public_id',
        'url',
        'width',
        'height',
        'type',
    ];
}
