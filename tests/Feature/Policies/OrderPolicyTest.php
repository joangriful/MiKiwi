<?php

declare(strict_types=1);

namespace Tests\Feature\Policies;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_admins_can_view_any_orders(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'customer']);

        $this->assertTrue($admin->can('viewAny', Order::class));
        $this->assertFalse($user->can('viewAny', Order::class));
    }

    public function test_users_can_view_their_own_orders(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($user->can('view', $order));
    }

    public function test_users_cannot_view_other_users_orders(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $otherUser->id]);

        $this->assertFalse($user->can('view', $order));
    }

    public function test_admins_can_view_any_order(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($admin->can('view', $order));
    }

    public function test_users_can_cancel_pending_orders(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'pending',
        ]);

        $this->assertTrue($user->can('cancel', $order));
    }

    public function test_users_cannot_cancel_shipped_orders(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'shipped',
        ]);

        $this->assertFalse($user->can('cancel', $order));
    }

    public function test_users_cannot_cancel_other_users_orders(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $otherUser->id,
            'status' => 'pending',
        ]);

        $this->assertFalse($user->can('cancel', $order));
    }
}
