<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class GoogleAuthController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            $email = $googleUser->getEmail();

            if (! is_string($email) || trim($email) === '') {
                return redirect()
                    ->route('login')
                    ->withErrors([
                        'email' => 'No pudimos obtener tu correo de Google. Inténtalo con otro método.',
                    ]);
            }

            $user = User::query()->where('email', $email)->first();

            if (! $user) {
                $displayName = $googleUser->getName() ?: $googleUser->getNickname() ?: 'Google User';

                $user = User::query()->create([
                    'name' => $displayName,
                    'email' => $email,
                    'password' => Str::random(64),
                    'email_verified_at' => now(),
                ]);
            }

            Auth::login($user);
            request()->session()->regenerate();

            return redirect()->route('home');
        } catch (Throwable $exception) {
            report($exception);

            return redirect()
                ->route('login')
                ->withErrors([
                    'email' => 'No se pudo iniciar sesión con Google. Inténtalo de nuevo.',
                ]);
        }
    }
}
