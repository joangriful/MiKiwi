<?php

namespace App\Domain\Admin\Services;

use App\Models\User;

class AdminUserService
{
    public function getComponentsManagerUsers()
    {
        return User::all(['id', 'name', 'email', 'username', 'role', 'created_at']);
    }
}
