<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatSession extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'status',
        'subject',
    ];

    protected $casts = [
        'status' => 'enum',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeClosed($query)
    {
        return $query->where('status', 'closed');
    }

    public function messages()
    {
        return $this->hasMany(ChatMessage::class, 'session_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
