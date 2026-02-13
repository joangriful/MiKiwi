<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;


class UserPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        return $user->role === 'admin' || $user->id === $model->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model): bool
    {
        return $user->role === 'admin' || $user->id === $model->id;
    }

    /**
     * CAMBIAR ROLES: método crítico
     * - Solo admins
     * - No auto-degradarse
     * - No quitar último admin
     */

    public function updateRole(User $user, User $model) 
    {
        if ($user->role !== 'admin') {
            return false;
        }

        if ($user->id === $model->id && $model->role === 'admin') {
            return false;
        }

        if ($model->role === 'admin' && User::where('role', 'admin')->count() <= 1) {
            return false;
        }

        return true;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model): bool
    {
        if ($user->id === $model->id) {
            return true;
        }


        return $user->role === 'admin' && $user->id !== $model->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, User $model): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, User $model): bool
    {
        return false;
    }
}
