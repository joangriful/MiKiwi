<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
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
        // Prevent self-demotion if desired, but for now just toggle
        $newRole = $user->role === 'admin' ? 'customer' : 'admin';
        $user->update(['role' => $newRole]);

        return back()->with('success', 'User role updated successfully.');
    }
}
