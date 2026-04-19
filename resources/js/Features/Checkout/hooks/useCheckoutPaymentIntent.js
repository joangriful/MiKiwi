import { useCallback } from 'react';
import { createPaymentIntent } from '@/Features/Checkout/services/checkoutApi';

export default function useCheckoutPaymentIntent() {
    const requestPaymentIntent = useCallback((amount) => createPaymentIntent(amount), []);

    return {
        requestPaymentIntent,
    };
}
