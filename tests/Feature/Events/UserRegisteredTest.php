<?php

declare(strict_types=1);

namespace Tests\Feature\Events;

use App\Events\UserRegistered;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserRegisteredTest extends TestCase
{
    use RefreshDatabase;

    public function test_event_contains_user(): void
    {
        $user = User::factory()->create();

        $event = new UserRegistered($user);

        $this->assertEquals($user->id, $event->user->id);
    }
}
