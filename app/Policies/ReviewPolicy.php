<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Review;
use App\Models\User;

class ReviewPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function view(User $user, Review $review): bool
    {
        return $this->isAdmin($user);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Review $review): bool
    {
        return $this->isAdmin($user);
    }

    public function approve(User $user, Review $review): bool
    {
        return $this->isAdmin($user);
    }

    public function delete(User $user, Review $review): bool
    {
        return $this->isAdmin($user);
    }

    private function isAdmin(User $user): bool
    {
        return $user->role === UserRole::Admin->value;
    }
}
