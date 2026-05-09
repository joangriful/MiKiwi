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
        return $this->getAdminUsers();
    }

    public function getIndexUsers(): Collection
    {
        return $this->getAdminUsers();
    }

    public function createUser(array $data): User
    {
        return User::query()->create([
            'name' => $data['name'],
            'username' => $data['username'] ?? null,
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $data['role'],
            'is_active' => $data['is_active'] ?? true,
        ]);
    }

    public function updateUser(User $user, array $data): void
    {
        $attributes = [
            'name' => $data['name'],
            'username' => $data['username'] ?? null,
            'email' => $data['email'],
            'role' => $data['role'],
        ];

        if (! empty($data['password'])) {
            $attributes['password'] = $data['password'];
        }

        $user->update($attributes);
    }

    public function toggleAdminRole(User $user): void
    {
        $newRole = $user->role === UserRole::Admin->value
            ? UserRole::Customer->value
            : UserRole::Admin->value;

        $user->update(['role' => $newRole]);
    }

    public function toggleActive(User $user): void
    {
        $user->update(['is_active' => ! $user->is_active]);
    }

    private function getAdminUsers(): Collection
    {
        return User::query()
            ->orderBy('created_at', 'desc')
            ->get([
                'id',
                'name',
                'email',
                'username',
                'role',
                'is_active',
                'email_verified_at',
                'created_at',
                'updated_at',
            ]);
    }
}
