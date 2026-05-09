<?php

namespace App\Http\Controllers;

use App\Domain\Admin\Services\AdminUserService;
use App\Http\Requests\Admin\StoreAdminUserRequest;
use App\Http\Requests\Admin\UpdateAdminUserRequest;
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

    public function store(StoreAdminUserRequest $request)
    {
        $this->adminUserService->createUser($request->validated());

        return back()->with('success', 'Usuario creado');
    }

    public function update(UpdateAdminUserRequest $request, User $user)
    {
        $validated = $request->validated();

        if ($request->user()?->is($user)) {
            $validated['role'] = $user->role;
        }

        $this->adminUserService->updateUser($user, $validated);

        return back()->with('success', 'Usuario actualizado');
    }

    public function toggleAdmin(User $user)
    {
        $this->authorize('toggleAdmin', $user);
        $this->adminUserService->toggleAdminRole($user);

        return back()->with('success', 'Rol actualizado');
    }

    public function toggleActive(User $user)
    {
        $this->authorize('toggleActive', $user);
        $this->adminUserService->toggleActive($user);

        return back()->with('success', 'Estado actualizado');
    }
}
