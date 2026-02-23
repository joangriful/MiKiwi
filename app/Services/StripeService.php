<?php

namespace App\Services;

use Illuminate\Support\Facades\Config;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class StripeService
{
    public function __construct()
    {
        Stripe::setApiKey(Config::get('services.stripe.secret'));
    }

    /**
     * Create a new PaymentIntent
     *
     * @param  float  $amount  Amount in EUR
     * @param  string  $currency  Currency (default: eur)
     * @param  array  $metadata  Additional metadata
     * @param  string|null  $customerId  Stripe Customer ID
     * @return PaymentIntent
     */
    public function createPaymentIntent($amount, $currency = 'eur', $metadata = [], $customerId = null)
    {
        $params = [
            'amount' => $amount * 100, // Stripe uses cents
            'currency' => $currency,
            'metadata' => $metadata,
            'automatic_payment_methods' => [
                'enabled' => true,
            ],
        ];

        if ($customerId) {
            $params['customer'] = $customerId;
            $params['setup_future_usage'] = 'off_session';
        }

        return PaymentIntent::create($params);
    }

    /**
     * Create or retrieve a Stripe Customer
     * 
     * @param \App\Models\User $user
     * @return \Stripe\Customer
     */
    public function getOrCreateCustomer($user)
    {
        if ($user->stripe_customer_id) {
            try {
                return \Stripe\Customer::retrieve($user->stripe_customer_id);
            } catch (\Exception $e) {
                // If retrieval fails (e.g. deleted in dashboard), create new
            }
        }

        $customer = \Stripe\Customer::create([
            'email' => $user->email,
            'name' => $user->name,
            'metadata' => [
                'user_id' => $user->id,
            ],
        ]);

        $user->update(['stripe_customer_id' => $customer->id]);

        return $customer;
    }

    /**
     * List payment methods for a customer
     * 
     * @param string $customerId
     * @return \Stripe\Collection
     */
    public function listPaymentMethods($customerId)
    {
        return \Stripe\PaymentMethod::all([
            'customer' => $customerId,
            'type' => 'card',
        ]);
    }

    /**
     * Retrieve a PaymentIntent by its ID
     *
     * @param  string  $id
     * @return PaymentIntent
     */
    public function getPaymentIntent($id)
    {
        return PaymentIntent::retrieve($id);
    }
}
