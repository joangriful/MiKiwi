<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class ChatSession extends Model
{

    use HasFactory, HasUuids;

    protected $fillable = [
        'status',
        'subject',
    ];

    public function messages() {
        return $this->hasMany(ChatMessage::class, 'session_id');
    }
    
    public function user() {
        return $this->belongsTo(User::class);
    }




}
