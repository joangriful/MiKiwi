<?php

namespace App\Services;

use Stripe\Stripe;
use Stripe\PaymentIntent;
use Illuminate\Support\Facades\Config;

class StripeService
{
    public function __construct()
    {
        Stripe::setApiKey(Config::get('services.stripe.secret'));
    }

    /**
     * Create a new PaymentIntent
     *
     * @param float $amount Amount in EUR
     * @param string $currency Currency (default: eur)
     * @param array $metadata Additional metadata
     * @return PaymentIntent
     */
    public function createPaymentIntent($amount, $currency = 'eur', $metadata = [])
    {
        return PaymentIntent::create([
            'amount' => $amount * 100, // Stripe uses cents
            'currency' => $currency,
            'metadata' => $metadata,
            'automatic_payment_methods' => [
                'enabled' => true,
            ],
        ]);
    }

    /**
     * Retrieve a PaymentIntent by its ID
     *
     * @param string $id
     * @return PaymentIntent
     */
    public function getPaymentIntent($id)
    {
        return PaymentIntent::retrieve($id);
    }
}
