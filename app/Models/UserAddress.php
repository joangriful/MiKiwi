<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class UserAddress extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'alias',
        'full_name',
        'phone',
        'street_address',
        'city',
        'postal_code',
        'country',
        'is_default',
    ];


    public function user() {
        return $this->belongsTo(User::class);
    }
}
