import { beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import {
    createPaymentIntent,
    fetchPickupPoints,
    fetchSavedPaymentMethods,
} from '@/Features/Checkout/services/checkoutApi';

vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

describe('checkoutApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        globalThis.route = vi.fn((name) => `/${name}`);
    });

    it('fetches saved payment methods from checkout endpoint', async () => {
        const fakeCards = [{ id: 'pm_1' }];
        axios.get.mockResolvedValueOnce({ data: fakeCards });

        const cards = await fetchSavedPaymentMethods();

        expect(globalThis.route).toHaveBeenCalledWith('payment-methods.index');
        expect(axios.get).toHaveBeenCalledWith('/payment-methods.index');
        expect(cards).toEqual(fakeCards);
    });

    it('resolves pickup points using postal code params', async () => {
        axios.get.mockResolvedValueOnce({ data: [] });

        await fetchPickupPoints(' 28001 ');

        expect(globalThis.route).toHaveBeenCalledWith('pickup-points.index');
        expect(axios.get).toHaveBeenCalledWith('/pickup-points.index', {
            params: { postal_code: '28001' },
        });
    });

    it('resolves pickup points using city params for non-postal queries', async () => {
        axios.get.mockResolvedValueOnce({ data: [] });

        await fetchPickupPoints('Madrid');

        expect(axios.get).toHaveBeenCalledWith('/pickup-points.index', {
            params: { city: 'Madrid' },
        });
    });

    it('creates payment intent with rounded amount', async () => {
        axios.post.mockResolvedValueOnce({ data: { clientSecret: 'sec_1' } });

        const intent = await createPaymentIntent(19.999);

        expect(globalThis.route).toHaveBeenCalledWith('payment-intent.create');
        expect(axios.post).toHaveBeenCalledWith('/payment-intent.create', {
            amount: 20,
        });
        expect(intent).toEqual({ clientSecret: 'sec_1' });
    });

    it('throws for invalid payment amount', async () => {
        await expect(createPaymentIntent(Number.NaN)).rejects.toThrow('Invalid checkout amount');
        expect(axios.post).not.toHaveBeenCalled();
    });
});
