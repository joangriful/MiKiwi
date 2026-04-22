<?php

namespace App\Http\Controllers;

use App\Domain\Payments\Services\StripeService;
use Illuminate\Support\Facades\Auth;

class PaymentMethodController extends Controller
{
    protected $stripeService;

    public function __construct(StripeService $stripeService)
    {
        $this->stripeService = $stripeService;
    }

    /**
     * List all payment methods for the current user
     */
    public function index()
    {
        $user = Auth::user();

        if (! $user->stripe_customer_id) {
            return response()->json([]);
        }

        $paymentMethods = $this->stripeService->listPaymentMethods($user->stripe_customer_id);

        return response()->json($paymentMethods->data);
    }

    /**
     * Create a SetupIntent for adding a new card
     */
    public function createSetupIntent()
    {
        $user = Auth::user();
        $customer = $this->stripeService->getOrCreateCustomer($user);

        $setupIntent = \Stripe\SetupIntent::create([
            'customer' => $customer->id,
            'payment_method_types' => ['card'],
        ]);

        return response()->json([
            'clientSecret' => $setupIntent->client_secret,
        ]);
    }

    /**
     * Delete a payment method
     */
    public function destroy($id)
    {
        try {
            $user = Auth::user();

            if (! $user?->stripe_customer_id) {
                return response()->json(['error' => 'No Stripe customer found for this user.'], 403);
            }

            if (! $this->stripeService->detachPaymentMethodForCustomer($id, $user->stripe_customer_id)) {
                return response()->json(['error' => 'Unauthorized payment method access.'], 403);
            }

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
