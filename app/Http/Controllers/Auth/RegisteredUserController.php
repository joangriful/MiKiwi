<?php

namespace App\Http\Controllers\Auth;

use App\Domain\Auth\Services\CheckoutAuthRedirectService;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function __construct(
        private readonly CheckoutAuthRedirectService $checkoutAuthRedirectService,
    ) {}

    /**
     * Display the registration view.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Auth/Auth', [
            'view' => 'register',
            ...$this->checkoutAuthRedirectService->inertiaPropsFromRequest($request),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Check if user has quiz data in the request (from frontend localStorage)
        if ($request->has('quiz_result_category')) {
            $user->update([
                'quiz_result_category' => $request->input('quiz_result_category'),
            ]);
        }

        return $this->checkoutAuthRedirectService->redirectAfterFormAuthentication($request);
    }
}
