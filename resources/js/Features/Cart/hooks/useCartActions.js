import { useCallback } from 'react';
import {
    addProductToCart,
    buyNowProduct,
    resolveBuyNowRedirect,
} from '@/Features/Cart/services/cartApi';

export default function useCartActions() {
    const addToCart = useCallback((payload) => addProductToCart(payload), []);
    const buyNow = useCallback((payload) => buyNowProduct(payload), []);
    const resolveBuyNowUrl = useCallback((responseData) => resolveBuyNowRedirect(responseData), []);

    return {
        addToCart,
        buyNow,
        resolveBuyNowUrl,
    };
}
