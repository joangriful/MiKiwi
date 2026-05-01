<?php

namespace App\Models;

use App\Enums\ChatSessionStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChatSession extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'chat_session';

    protected $fillable = [
        'user_id',
        'status',
        'subject',
    ];

    protected $casts = [
        'status' => ChatSessionStatus::class,
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeClosed($query)
    {
        return $query->where('status', 'closed');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class, 'chat_session_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
