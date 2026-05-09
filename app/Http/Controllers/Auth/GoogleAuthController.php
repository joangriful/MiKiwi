<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Domain\Auth\Actions\FindOrCreateGoogleUser;
use App\Domain\Auth\Actions\GoogleAuthEmailMissingException;
use App\Domain\Auth\Services\CheckoutAuthRedirectService;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Contracts\Provider;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;
use Throwable;

class GoogleAuthController extends Controller
{
    public function __construct(
        private readonly FindOrCreateGoogleUser $findOrCreateGoogleUser,
        private readonly CheckoutAuthRedirectService $checkoutAuthRedirectService,
    ) {}

    public function redirect(Request $request): RedirectResponse
    {
        $this->checkoutAuthRedirectService->storeSocialIntent($request);

        return $this->googleProvider()->redirect();
    }

    public function callback(): RedirectResponse
    {
        try {
            $googleUser = $this->googleProvider()->user();
            $user = $this->findOrCreateGoogleUser->execute($googleUser);

            Auth::login($user);
            request()->session()->regenerate();

            return $this->checkoutAuthRedirectService->redirectAfterSocialAuthentication(request());
        } catch (GoogleAuthEmailMissingException) {
            return redirect()
                ->route('login')
                ->withErrors([
                    'email' => 'No pudimos obtener tu correo de Google. Inténtalo con otro método.',
                ]);
        } catch (InvalidStateException) {
            return redirect()
                ->route('login')
                ->withErrors([
                    'email' => 'La sesión de Google ha caducado. Inténtalo de nuevo.',
                ]);
        } catch (Throwable $exception) {
            report($exception);

            return redirect()
                ->route('login')
                ->withErrors([
                    'email' => 'No se pudo iniciar sesión con Google. Inténtalo de nuevo.',
                ]);
        }
    }

    private function googleProvider(): Provider
    {
        return Socialite::driver('google')
            ->scopes(['openid', 'profile', 'email'])
            ->with(['prompt' => 'select_account']);
    }
}
