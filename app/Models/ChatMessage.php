<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ChatMessage extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'sender_type',
        'message_body',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolen',
    ];


    public function session() {
        return $this->belongsTo(ChatSession::class, 'session_id');
    }
}
