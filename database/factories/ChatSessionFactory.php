<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\ChatSessionStatus;
use App\Models\ChatSession;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory for creating ChatSession test instances.
 *
 * Generates chat sessions with various states (active/closed)
 * and supports both authenticated and guest users.
 *
 * @extends Factory<ChatSession>
 */
class ChatSessionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * Creates an active chat session with a random subject.
     * By default, sessions are associated with a user, but can be
     * created as guest sessions using the guest() state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'status' => ChatSessionStatus::Active,
            'subject' => $this->faker->sentence(4),
        ];
    }

    /**
     * Indicate that the chat session is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ChatSessionStatus::Active,
        ]);
    }

    /**
     * Indicate that the chat session is closed.
     */
    public function closed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ChatSessionStatus::Closed,
        ]);
    }

    /**
     * Create a guest chat session (no user_id).
     *
     * Guest sessions are not associated with any authenticated user.
     */
    public function guest(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => null,
            'subject' => 'Consulta de invitado - '.$this->faker->sentence(3),
        ]);
    }

    /**
     * Create a chat session for a specific user.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}
