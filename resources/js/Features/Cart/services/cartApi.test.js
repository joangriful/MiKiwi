import { beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import {
    addProductToCart,
    buyNowProduct,
    resolveBuyNowRedirect,
} from '@/Features/Cart/services/cartApi';

vi.mock('axios', () => ({
    default: {
        post: vi.fn(),
    },
}));

describe('cartApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        globalThis.route = vi.fn((name, params) => {
            if (name === 'cart.index') {
                return `/cart?buy_now=${params?.buy_now ?? ''}`;
            }

            return `/${name}`;
        });
    });

    it('adds product to cart using normalized quantity', async () => {
        axios.post.mockResolvedValueOnce({ data: { ok: true } });

        await addProductToCart({ productSlug: 'mobi', quantity: 2.9 });

        expect(globalThis.route).toHaveBeenCalledWith('cart.add');
        expect(axios.post).toHaveBeenCalledWith('/cart.add', {
            product_slug: 'mobi',
            quantity: 2,
        });
    });

    it('creates buy-now request for a product', async () => {
        axios.post.mockResolvedValueOnce({ data: { redirect: '/checkout' } });

        const response = await buyNowProduct({ productSlug: 'mobi', quantity: 1 });

        expect(globalThis.route).toHaveBeenCalledWith('cart.buy-now');
        expect(axios.post).toHaveBeenCalledWith('/cart.buy-now', {
            product_slug: 'mobi',
            quantity: 1,
        });
        expect(response).toEqual({ redirect: '/checkout' });
    });

    it('resolves buy-now redirect fallback when backend does not return redirect', () => {
        const url = resolveBuyNowRedirect({});

        expect(globalThis.route).toHaveBeenCalledWith('cart.index', { buy_now: 1 });
        expect(url).toBe('/cart?buy_now=1');
    });

    it('throws when product slug is invalid', async () => {
        await expect(addProductToCart({ productSlug: '', quantity: 1 })).rejects.toThrow('Invalid product slug');
        expect(axios.post).not.toHaveBeenCalled();
    });
});
