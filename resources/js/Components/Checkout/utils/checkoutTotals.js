export const SHIPPING_COSTS = {
    standard: 3.99,
    pickup: 2.99,
};

export function normalizeCheckoutCart(cart, fallbackTotal = 0) {
    if (Array.isArray(cart)) {
        const total = Number.parseFloat(fallbackTotal) || calculateItemsTotal(cart);

        return {
            items: cart,
            total,
            item_count: cart.length,
        };
    }

    const items = Array.isArray(cart?.items) ? cart.items : [];
    const total = Number.parseFloat(cart?.total ?? fallbackTotal) || calculateItemsTotal(items);

    return {
        ...cart,
        items,
        total,
        item_count: cart?.item_count ?? items.length,
    };
}

export function getShippingCost(shippingMethod) {
    return SHIPPING_COSTS[shippingMethod] || 0;
}

export function calculateCheckoutTotals({ cart, shippingMethod, step, coupon }) {
    const subtotal = Number.parseFloat(cart?.total) || 0;
    const shippingCost = step >= 3 ? getShippingCost(shippingMethod) : 0;
    const couponDiscount = coupon ? Number.parseFloat(coupon.discount) || 0 : 0;
    const total = subtotal + shippingCost;

    return {
        subtotal,
        shippingCost,
        couponDiscount,
        total,
        finalTotal: total - couponDiscount,
    };
}

function calculateItemsTotal(items) {
    return items.reduce((sum, item) => {
        const subtotal = Number.parseFloat(item?.subtotal);

        if (Number.isFinite(subtotal)) {
            return sum + subtotal;
        }

        const price = Number.parseFloat(item?.unit_price ?? item?.product?.base_price) || 0;
        const quantity = Number.parseInt(item?.quantity, 10) || 0;

        return sum + price * quantity;
    }, 0);
}
