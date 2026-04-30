<?php

declare(strict_types=1);

namespace App\Domain\Admin\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class AdminUserService
{
    public function getComponentsManagerUsers(): Collection
    {
        return User::query()->get(['id', 'name', 'email', 'username', 'role', 'created_at']);
    }
}
