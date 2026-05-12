import { loadStripe } from "@stripe/stripe-js";

export function resolveStripeKey(stripeKey) {
    const inertiaKey = typeof stripeKey === "string" ? stripeKey.trim() : "";
    const viteKey = typeof import.meta.env.VITE_STRIPE_KEY === "string"
        ? import.meta.env.VITE_STRIPE_KEY.trim()
        : "";

    return inertiaKey || viteKey || null;
}

export function createStripePromise(stripeKey) {
    const resolvedKey = resolveStripeKey(stripeKey);

    return resolvedKey ? loadStripe(resolvedKey) : null;
}
