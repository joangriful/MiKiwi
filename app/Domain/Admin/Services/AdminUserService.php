<?php

declare(strict_types=1);

namespace App\Domain\Admin\Services;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class AdminUserService
{
    public function getComponentsManagerUsers(): Collection
    {
        return User::query()->get(['id', 'name', 'email', 'username', 'role', 'created_at']);
    }

    public function getIndexUsers(): Collection
    {
        return User::query()->get(['id', 'name', 'email', 'username', 'role', 'created_at']);
    }

    public function toggleAdminRole(User $user): void
    {
        $newRole = $user->role === UserRole::Admin->value
            ? UserRole::Customer->value
            : UserRole::Admin->value;

        $user->update(['role' => $newRole]);
    }
}
