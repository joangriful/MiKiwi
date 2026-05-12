<?php

namespace App\Domain\Payments\Services;

use Illuminate\Support\Facades\Config;
use Stripe\Customer;
use Stripe\PaymentIntent;
use Stripe\PaymentMethod;
use Stripe\SetupIntent;
use Stripe\Stripe;

class StripeService
{
    public function __construct()
    {
        Stripe::setApiKey(Config::get('services.stripe.secret'));
    }

    public function isConfigured(): bool
    {
        return filled(Config::get('services.stripe.secret'));
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
    public function createPaymentIntent($amount, $currency = 'eur', $metadata = [], $customerId = null, $saveCard = false)
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

            // Only save if explicitly requested (usually for new cards)
            if ($saveCard) {
                $params['setup_future_usage'] = 'off_session';
            }
        }

        return $this->createStripePaymentIntent($params);
    }

    /**
     * Create or retrieve a Stripe Customer
     *
     * @param  \App\Models\User  $user
     */
    public function getOrCreateCustomer($user): Customer
    {
        if ($user->stripe_customer_id) {
            try {
                return Customer::retrieve($user->stripe_customer_id);
            } catch (\Exception $e) {
                // If retrieval fails (e.g. deleted in dashboard), create new
            }
        }

        $customer = Customer::create([
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
     * Create a SetupIntent for adding a new card to a user account.
     *
     * @param  \App\Models\User  $user
     */
    public function createSetupIntentForUser($user): SetupIntent
    {
        $customer = $this->getOrCreateCustomer($user);

        return SetupIntent::create([
            'customer' => $customer->id,
            'payment_method_types' => ['card'],
        ]);
    }

    /**
     * List payment methods for a customer
     *
     * @param  string  $customerId
     * @return \Stripe\Collection
     */
    public function listPaymentMethods($customerId)
    {
        $methods = $this->allStripePaymentMethods([
            'customer' => $customerId,
            'type' => 'card',
        ]);

        // Filter duplicates by fingerprint to keep the UI clean
        $uniqueMethods = [];
        $fingerprints = [];

        foreach ($methods->data as $method) {
            $fingerprint = $method->card->fingerprint ?? null;

            if ($fingerprint && ! in_array($fingerprint, $fingerprints)) {
                $uniqueMethods[] = $method;
                $fingerprints[] = $fingerprint;
            } elseif (! $fingerprint) {
                // If no fingerprint, keep it just in case
                $uniqueMethods[] = $method;
            }
        }

        $methods->data = $uniqueMethods;

        return $methods;
    }

    /**
     * Retrieve a payment method by its ID.
     */
    public function retrievePaymentMethod(string $id): PaymentMethod
    {
        return PaymentMethod::retrieve($id);
    }

    /**
     * Detach a payment method only if it belongs to the expected customer.
     */
    public function detachPaymentMethodForCustomer(string $paymentMethodId, string $customerId): bool
    {
        $paymentMethod = $this->retrievePaymentMethod($paymentMethodId);

        if (($paymentMethod->customer ?? null) !== $customerId) {
            return false;
        }

        $paymentMethod->detach();

        return true;
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

    /**
     * @param  array<string, mixed>  $params
     */
    protected function createStripePaymentIntent(array $params): PaymentIntent
    {
        /** @var PaymentIntent $paymentIntent */
        $paymentIntent = PaymentIntent::create($params);

        return $paymentIntent;
    }

    /**
     * @param  array<string, mixed>  $params
     */
    protected function allStripePaymentMethods(array $params)
    {
        return PaymentMethod::all($params);
    }
}
