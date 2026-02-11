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
        // Verificación rápida de seguridad (o usa una Policy si prefieres)
        if (auth()->user()->role !== 'admin') {
            abort(403, 'No tienes permisos para realizar esta acción.');
        }

        // Cambiar estado
        $user->role = ($user->role === 'admin') ? 'user' : 'admin';
        $user->save();

        return response()->json([
            'message' => 'Rol de usuario actualizado correctamente.',
            'user' => $user
        ]);
    }
}
