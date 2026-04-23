<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\InteractsWithApiErrors;
use App\Domain\Payments\Services\StripeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PaymentMethodController extends Controller
{
    use InteractsWithApiErrors;

    protected StripeService $stripeService;

    public function __construct(StripeService $stripeService)
    {
        $this->stripeService = $stripeService;
    }

    /**
     * List all payment methods for the current user
     */
    public function index(): JsonResponse
    {
        try {
            $user = Auth::user();

            if (! $user->stripe_customer_id) {
                return response()->json([]);
            }

            $paymentMethods = $this->stripeService->listPaymentMethods($user->stripe_customer_id);

            return response()->json($paymentMethods->data);
        } catch (\Exception $e) {
            Log::error('Payment method list failed: '.$e->getMessage());

            return $this->apiError(
                'payment_method_list_failed',
                'No pudimos cargar tus tarjetas guardadas. Inténtalo de nuevo en unos minutos.',
                500
            );
        }
    }

    /**
     * Create a SetupIntent for adding a new card
     */
    public function createSetupIntent(): JsonResponse
    {
        try {
            $user = Auth::user();
            $setupIntent = $this->stripeService->createSetupIntentForUser($user);

            return response()->json([
                'clientSecret' => $setupIntent->client_secret,
            ]);
        } catch (\Exception $e) {
            Log::error('Payment method setup intent failed: '.$e->getMessage());

            return $this->apiError(
                'payment_method_setup_failed',
                'No pudimos iniciar el registro de tu tarjeta. Inténtalo de nuevo en unos minutos.',
                500
            );
        }
    }

    /**
     * Delete a payment method
     */
    public function destroy($id): JsonResponse
    {
        try {
            $user = Auth::user();

            if (! $user?->stripe_customer_id) {
                return $this->apiError(
                    'payment_method_delete_forbidden',
                    'No pudimos eliminar esta tarjeta porque no está disponible para tu cuenta.',
                    403
                );
            }

            if (! $this->stripeService->detachPaymentMethodForCustomer($id, $user->stripe_customer_id)) {
                return $this->apiError(
                    'payment_method_delete_forbidden',
                    'No pudimos eliminar esta tarjeta porque no está disponible para tu cuenta.',
                    403
                );
            }

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Payment method delete failed: '.$e->getMessage());

            return $this->apiError(
                'payment_method_delete_failed',
                'No pudimos eliminar tu tarjeta en este momento. Inténtalo de nuevo más tarde.',
                500
            );
        }
    }
}
