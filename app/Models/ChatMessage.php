<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatMessage extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'chat_message';

    protected $fillable = [
        'chat_session_id',
        'session_id',
        'message_body',
        'sender_type',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];

    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope a query to only include messages for a specific session.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $chatSessionId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeBySession($query, $chatSessionId)
    {
        return $query->where('chat_session_id', $chatSessionId);
    }

    public function getSessionIdAttribute(): ?string
    {
        return $this->attributes['chat_session_id'] ?? null;
    }

    public function setSessionIdAttribute(?string $value): void
    {
        $this->attributes['chat_session_id'] = $value;
    }

    public function chatSession(): BelongsTo
    {
        return $this->belongsTo(ChatSession::class, 'chat_session_id');
    }

    public function session(): BelongsTo
    {
        return $this->chatSession();
    }
}
