import axios from 'axios';

function assertValidPaymentMethodId(id) {
    if (!id || (typeof id !== 'string' && typeof id !== 'number')) {
        throw new Error('Invalid payment method id');
    }
}

export async function createPaymentMethodSetupIntent() {
    const { data } = await axios.post(route('payment-methods.setup-intent'));
    return data;
}

export async function fetchPaymentMethods() {
    const { data } = await axios.get(route('payment-methods.index'));
    return data;
}

export async function removePaymentMethod(id) {
    assertValidPaymentMethodId(id);
    await axios.delete(route('payment-methods.destroy', id));
}

export const paymentMethodsApi = {
    createPaymentMethodSetupIntent,
    fetchPaymentMethods,
    removePaymentMethod,
};
