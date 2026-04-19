import axios from 'axios';

function normalizeQuantity(quantity) {
    const parsed = Number(quantity);

    if (!Number.isFinite(parsed) || parsed <= 0) {
        return 1;
    }

    return Math.floor(parsed);
}

function assertValidProductSlug(productSlug) {
    if (!productSlug || typeof productSlug !== 'string') {
        throw new Error('Invalid product slug');
    }
}

export async function addProductToCart({ productSlug, quantity = 1 }) {
    assertValidProductSlug(productSlug);

    const { data } = await axios.post(route('cart.add'), {
        product_slug: productSlug,
        quantity: normalizeQuantity(quantity),
    });

    return data;
}

export async function buyNowProduct({ productSlug, quantity = 1 }) {
    assertValidProductSlug(productSlug);

    const { data } = await axios.post(route('cart.buy-now'), {
        product_slug: productSlug,
        quantity: normalizeQuantity(quantity),
    });

    return data;
}

export function resolveBuyNowRedirect(responseData) {
    if (responseData?.redirect) {
        return responseData.redirect;
    }

    return route('cart.index', { buy_now: 1 });
}

export const cartApi = {
    addProductToCart,
    buyNowProduct,
    resolveBuyNowRedirect,
};
