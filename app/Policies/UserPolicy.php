<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    /**
     * Solo admins pueden ver listado completo
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Ver perfil: propio o si es admin
     */
    public function view(User $authenticatedUser, User $targetUser): bool
    {
        return $authenticatedUser->id === $targetUser->id 
            || $authenticatedUser->role === 'admin';
    }

    /**
     * Crear usuarios: solo admins
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Editar: propio perfil o admin
     */
    public function update(User $authenticatedUser, User $targetUser): bool
    {
        return $authenticatedUser->id === $targetUser->id 
            || $authenticatedUser->role === 'admin';
    }

    /**
     * - Solo admins pueden
     * - No auto-degradarse
     */
    public function toggleAdmin(User $authenticatedUser, User $targetUser): Response
    {
        if ($authenticatedUser->role !== 'admin') {
            return Response::deny('Solo los administradores pueden cambiar roles.');
        }

        if ($authenticatedUser->id === $targetUser->id) {
            return Response::deny('No puedes quitarte tu propio rol de admin.');
        }

        return Response::allow();
    }

    /**
     * Eliminar: solo admin (no auto-eliminarse)
     */
    public function delete(User $authenticatedUser, User $targetUser): Response
    {
        if ($authenticatedUser->id === $targetUser->id) {
            return Response::deny('No puedes eliminar tu propia cuenta.');
        }

        if ($authenticatedUser->role !== 'admin') {
            return Response::deny('No tienes permisos para eliminar usuarios.');
        }

        return Response::allow();
    }
}
