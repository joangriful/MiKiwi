import { beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import {
    createPaymentMethodSetupIntent,
    fetchPaymentMethods,
    removePaymentMethod,
} from '@/Features/Payments/services/paymentMethodsApi';

vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('paymentMethodsApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        globalThis.route = vi.fn((name, id) => (typeof id === 'undefined' ? `/${name}` : `/${name}/${id}`));
    });

    it('creates setup intent for payment method registration', async () => {
        axios.post.mockResolvedValueOnce({ data: { clientSecret: 'seti_secret' } });

        const response = await createPaymentMethodSetupIntent();

        expect(globalThis.route).toHaveBeenCalledWith('payment-methods.setup-intent');
        expect(axios.post).toHaveBeenCalledWith('/payment-methods.setup-intent');
        expect(response).toEqual({ clientSecret: 'seti_secret' });
    });

    it('fetches available payment methods', async () => {
        axios.get.mockResolvedValueOnce({ data: [{ id: 'pm_1' }] });

        const cards = await fetchPaymentMethods();

        expect(globalThis.route).toHaveBeenCalledWith('payment-methods.index');
        expect(axios.get).toHaveBeenCalledWith('/payment-methods.index');
        expect(cards).toEqual([{ id: 'pm_1' }]);
    });

    it('removes a payment method by id', async () => {
        axios.delete.mockResolvedValueOnce({});

        await removePaymentMethod('pm_1');

        expect(globalThis.route).toHaveBeenCalledWith('payment-methods.destroy', 'pm_1');
        expect(axios.delete).toHaveBeenCalledWith('/payment-methods.destroy/pm_1');
    });

    it('fails fast when removing payment method with invalid id', async () => {
        await expect(removePaymentMethod('')).rejects.toThrow('Invalid payment method id');
        expect(axios.delete).not.toHaveBeenCalled();
    });
});
