<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all(['id', 'name', 'email', 'username', 'role', 'created_at']);

        return response()->json($users); // Or return Inertia render if used directly
    }

    public function toggleAdmin(User $user)
    {
        $this->authorize('toggleAdmin', $user);  // ← Protección activa

        $newRole = $user->role === 'admin' ? 'customer' : 'admin';
        $user->update(['role' => $newRole]);

        return back()->with('success', 'Rol actualizado');
    }
}
