<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // <--- LA CLAVE

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasUuids;

    protected $fillable = [
        'name',
        'email',
        'password',
        'dni',
        'birth_date',
        'role',
        'is_active'
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'birth_date' => 'date',
        'is_active' => 'boolean',
    ];


    protected $hidden = [
        'password',
        'remenber_token',
    ];

    // Relación con direcciones (para el futuro)
    public function addresses()
    {
        return $this->hasMany(UserAddress::class);
    }

    public function orders() {
        return $this->hasMany(Orders::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function chatSessions()
    {
        return $this->hasMany(ChatSession::class);
    }
}
