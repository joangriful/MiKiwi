import axios from 'axios';
import { fetchPaymentMethods } from '@/Features/Payments/services/paymentMethodsApi';

function toSafeString(value) {
    return typeof value === 'string' ? value.trim() : '';
}

function resolvePickupQueryParams(query) {
    const safeQuery = toSafeString(query);
    const isPostalCode = /^\d{4,5}$/.test(safeQuery);

    if (!safeQuery) {
        return { city: '' };
    }

    return isPostalCode
        ? { postal_code: safeQuery }
        : { city: safeQuery };
}

export async function fetchSavedPaymentMethods() {
    return fetchPaymentMethods();
}

export async function fetchPickupPoints(query = '') {
    const { data } = await axios.get(route('pickup-points.index'), {
        params: resolvePickupQueryParams(query),
    });

    return data;
}

export async function createPaymentIntent(amount) {
    const normalizedAmount = Number(amount);

    if (!Number.isFinite(normalizedAmount) || normalizedAmount < 0) {
        throw new Error('Invalid checkout amount');
    }

    const { data } = await axios.post(route('payment-intent.create'), {
        amount: Math.round(normalizedAmount * 100) / 100,
    });

    return data;
}

export const checkoutApi = {
    fetchSavedPaymentMethods,
    fetchPickupPoints,
    createPaymentIntent,
};
