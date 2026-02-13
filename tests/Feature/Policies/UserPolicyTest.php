<?php

declare(strict_types=1);

namespace Tests\Feature\Policies;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_admins_can_view_any_users(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'customer']);

        $this->assertTrue($admin->can('viewAny', User::class));
        $this->assertFalse($user->can('viewAny', User::class));
    }

    public function test_users_can_view_their_own_profile(): void
    {
        $user = User::factory()->create(['role' => 'customer']);

        $this->assertTrue($user->can('view', $user));
    }

    public function test_users_cannot_view_other_users_profiles(): void
    {
        $user = User::factory()->create(['role' => 'customer']);
        $otherUser = User::factory()->create(['role' => 'customer']);

        $this->assertFalse($user->can('view', $otherUser));
    }

    public function test_admins_can_view_any_user_profile(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'customer']);

        $this->assertTrue($admin->can('view', $user));
    }

    public function test_only_admins_can_toggle_admin_role(): void
    {
        // Create multiple admins to avoid "last admin" restriction
        User::factory()->count(2)->create(['role' => 'admin']);

        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'customer']);

        $this->assertTrue($admin->can('toggleAdmin', $user));
        $this->assertFalse($user->can('toggleAdmin', $admin));
    }

    public function test_admin_cannot_remove_own_admin_role(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->assertFalse($admin->can('toggleAdmin', $admin));
    }
}
