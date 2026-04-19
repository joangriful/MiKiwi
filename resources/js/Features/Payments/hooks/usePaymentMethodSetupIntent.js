import { useCallback } from 'react';
import { createPaymentMethodSetupIntent } from '@/Features/Payments/services/paymentMethodsApi';

export default function usePaymentMethodSetupIntent() {
    const requestSetupIntent = useCallback(() => createPaymentMethodSetupIntent(), []);

    return {
        requestSetupIntent,
    };
}
