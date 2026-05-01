<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DollPartPosition extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'doll_part_position';

    protected $fillable = [
        'part_id',
        'category',
        'view',
        'x',
        'y',
        'scale',
    ];

    protected $casts = [
        'x' => 'float',
        'y' => 'float',
        'scale' => 'float',
    ];
}
