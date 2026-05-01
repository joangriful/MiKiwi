<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\ChatSenderType;
use App\Models\ChatMessage;
use App\Models\ChatSession;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory for creating ChatMessage test instances.
 *
 * Generates chat messages with different sender types (customer/agent)
 * and read/unread states for comprehensive testing scenarios.
 *
 * @extends Factory<ChatMessage>
 */
class ChatMessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * Creates an unread message from a customer with realistic content.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'chat_session_id' => ChatSession::factory(),
            'sender_type' => ChatSenderType::Customer->value,
            'message_body' => $this->faker->paragraph(2),
            'is_read' => false,
        ];
    }

    /**
     * Indicate that the message is from a customer.
     */
    public function fromCustomer(): static
    {
        return $this->state(fn (array $attributes) => [
            'sender_type' => ChatSenderType::Customer->value,
        ]);
    }

    /**
     * Indicate that the message is from an agent.
     */
    public function fromAgent(): static
    {
        return $this->state(fn (array $attributes) => [
            'sender_type' => ChatSenderType::Agent->value,
        ]);
    }

    /**
     * Indicate that the message has been read.
     */
    public function read(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_read' => true,
        ]);
    }

    /**
     * Indicate that the message is unread.
     */
    public function unread(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_read' => false,
        ]);
    }

    /**
     * Create a message for a specific chat session.
     */
    public function forSession(ChatSession $session): static
    {
        return $this->state(fn (array $attributes) => [
            'chat_session_id' => $session->id,
        ]);
    }
}
