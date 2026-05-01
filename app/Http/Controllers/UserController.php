<?php

namespace App\Http\Controllers;

use App\Domain\Admin\Services\AdminUserService;
use App\Models\User;

class UserController extends Controller
{
    public function __construct(
        private readonly AdminUserService $adminUserService,
    ) {}

    public function index()
    {
        $this->authorize('viewAny', User::class);

        return response()->json($this->adminUserService->getIndexUsers());
    }

    public function toggleAdmin(User $user)
    {
        $this->authorize('toggleAdmin', $user);
        $this->adminUserService->toggleAdminRole($user);

        return back()->with('success', 'Rol actualizado');
    }
}
