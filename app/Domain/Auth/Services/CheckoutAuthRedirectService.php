<?php

declare(strict_types=1);

namespace App\Domain\Auth\Services;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CheckoutAuthRedirectService
{
    private const SESSION_INTENT_KEY = 'checkout_auth_intent';

    /**
     * @return array{checkoutIntent: bool, checkoutBuyNow: bool}
     */
    public function inertiaPropsFromRequest(Request $request): array
    {
        return [
            'checkoutIntent' => $request->boolean('checkout'),
            'checkoutBuyNow' => $request->boolean('buy_now'),
        ];
    }

    public function redirectAfterFormAuthentication(Request $request): RedirectResponse
    {
        if (! $request->boolean('checkout_auth_intent')) {
            return redirect()->route('home');
        }

        return $this->redirectToCheckoutInfo($request->boolean('checkout_buy_now'));
    }

    public function storeSocialIntent(Request $request): void
    {
        if (! $request->boolean('checkout')) {
            $request->session()->forget(self::SESSION_INTENT_KEY);

            return;
        }

        $request->session()->put(self::SESSION_INTENT_KEY, [
            'buy_now' => $request->boolean('buy_now'),
        ]);
    }

    public function redirectAfterSocialAuthentication(Request $request): RedirectResponse
    {
        $checkoutIntent = $request->session()->pull(self::SESSION_INTENT_KEY, false);

        if (! $checkoutIntent) {
            return redirect()->route('home');
        }

        return $this->redirectToCheckoutInfo(
            is_array($checkoutIntent) && ($checkoutIntent['buy_now'] ?? false)
        );
    }

    private function redirectToCheckoutInfo(bool $buyNow): RedirectResponse
    {
        return redirect()->route('cart.index', [
            'checkout_step' => 'info',
            'buy_now' => $buyNow ? 1 : null,
        ]);
    }
}
