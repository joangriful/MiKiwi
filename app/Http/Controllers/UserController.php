<?php

namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', User::class);

        $users = User::all(['id', 'name', 'email', 'username', 'role', 'created_at']);

        return response()->json($users);
    }

    public function toggleAdmin(User $user)
    {
        $this->authorize('toggleAdmin', $user);  // ← Protección activa

        $newRole = $user->role === 'admin' ? 'customer' : 'admin';
        $user->update(['role' => $newRole]);

        return back()->with('success', 'Rol actualizado');
    }
}
