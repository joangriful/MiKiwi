<?php

namespace App\Http\Controllers\Auth;

use App\Domain\Auth\Services\CheckoutAuthRedirectService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function __construct(
        private readonly CheckoutAuthRedirectService $checkoutAuthRedirectService,
    ) {}

    /**
     * Display the login view.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Auth/Auth', [
            'view' => 'login',
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            ...$this->checkoutAuthRedirectService->inertiaPropsFromRequest($request),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Check if user has quiz data in the request (from frontend localStorage)
        if ($request->has('quiz_result_category')) {
            $user = $request->user();
            if ($user) {
                $user->update([
                    'quiz_result_category' => $request->input('quiz_result_category'),
                ]);
            }
        }

        return $this->checkoutAuthRedirectService->redirectAfterFormAuthentication($request);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
