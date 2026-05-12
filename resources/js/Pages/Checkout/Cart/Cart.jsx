import { useEffect, useMemo, useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutOrderSummary from "@/Components/Checkout/CheckoutOrderSummary/CheckoutOrderSummary";
import CheckoutProgress from "@/Components/Checkout/CheckoutProgress/CheckoutProgress";
import CheckoutStepRenderer from "@/Components/Checkout/CheckoutStepRenderer/CheckoutStepRenderer";
import {
    calculateCheckoutTotals,
    normalizeCheckoutCart,
} from "@/Components/Checkout/utils/checkoutTotals";
import Footer from "@/Components/Footer/Footer";
import Header from "@/Components/Header/Header";
import styles from "./Cart.module.css";

// Stripe is initialized dynamically via the stripeKey prop

const DEFAULT_AUTH = { user: null };
const DEFAULT_CART = { items: [], total: 0 };

export default function Cart({
    cart: cartProp = DEFAULT_CART,
    auth = DEFAULT_AUTH,
    user = null,
    popularProducts = [],
    stripeKey,
    coupon = null,
    isBuyNow = false,
    checkoutStep = null,
    total: totalProp = 0,
}) {
    const cart = useMemo(
        () => normalizeCheckoutCart(cartProp, totalProp),
        [cartProp, totalProp],
    );
    const checkoutAuth = useMemo(
        () => ({ user: auth?.user || user || null }),
        [auth?.user, user],
    );
    const finalStripePromise = useMemo(
        () => (stripeKey ? loadStripe(stripeKey) : null),
        [stripeKey],
    );
    const [step, setStep] = useState(1);

    const form = useForm(createInitialCheckoutData(cart));
    const hasCartItems = cart.items.length > 0;

    const totals = calculateCheckoutTotals({
        cart,
        shippingMethod: form.data.shipping_method,
        step,
        coupon,
    });

    useEffect(() => {
        if (!hasCartItems) {
            setStep(1);
        }
    }, [hasCartItems]);

    useEffect(() => {
        if (checkoutStep === "info" && checkoutAuth.user && hasCartItems) {
            setStep(2);
        }
    }, [checkoutAuth.user, checkoutStep, hasCartItems]);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? "auto" : "smooth",
        });
    }, [step]);

    const nextStep = () => {
        if (!hasCartItems) {
            setStep(1);

            return;
        }

        setStep((currentStep) => Math.min(currentStep + 1, 4));
    };
    const prevStep = () => setStep((currentStep) => Math.max(currentStep - 1, 1));

    const startCheckout = () => {
        if (!hasCartItems) {
            setStep(1);

            return;
        }

        if (!checkoutAuth.user) {
            router.visit(route("login", {
                checkout: 1,
                buy_now: isBuyNow ? 1 : 0,
            }));

            return;
        }

        setStep(2);
    };

    const applyCoupon = () => {
        if (form.processing) {
            return;
        }

        form.post(route("cart.coupon.apply"), {
            preserveScroll: true,
            onSuccess: () => form.setData("coupon_code", ""),
        });
    };

    const removeCoupon = () => {
        form.delete(route("cart.coupon.remove"), {
            preserveScroll: true,
        });
    };

    const handleRemoveItem = (itemId) => {
        form.delete(route("cart.remove", itemId), {
            data: isBuyNow ? { buy_now: 1 } : {},
            preserveScroll: true,
        });
    };

    return (
        <Elements stripe={finalStripePromise}>
            <div className={styles.root}>
                <Head title="Checkout - MiKiwi" />
                <Header user={checkoutAuth.user} />

                <main className={styles.main}>
                    <section className={styles.checkoutColumn} aria-label="Checkout">
                        <CheckoutProgress currentStep={step} />
                        <CheckoutStepRenderer
                            cart={cart}
                            auth={checkoutAuth}
                            step={step}
                            nextStep={nextStep}
                            prevStep={prevStep}
                            isBuyNow={isBuyNow}
                            form={form}
                            popularProducts={popularProducts}
                            finalTotal={totals.finalTotal}
                        />
                    </section>

                    <CheckoutOrderSummary
                        cart={cart}
                        coupon={coupon}
                        couponCode={form.data.coupon_code}
                        couponError={form.errors.coupon || form.errors.code}
                        couponProcessing={form.processing}
                        onCouponCodeChange={(value) => form.setData("coupon_code", value)}
                        onApplyCoupon={applyCoupon}
                        onRemoveCoupon={removeCoupon}
                        onRemoveItem={handleRemoveItem}
                        onCheckout={startCheckout}
                        canCheckout={hasCartItems}
                        isBuyNow={isBuyNow}
                        step={step}
                        totals={totals}
                    />
                </main>

                <Footer />
            </div>
        </Elements>
    );
}

function createInitialCheckoutData(cart) {
    return {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        dni: "",
        street_address: "",
        city: "",
        postal_code: "",
        country: "ES",
        shipping_method: "standard",
        pickup_point_id: null,
        payment_method: "stripe",
        selected_payment_method: null,
        payment_intent_id: null,
        billing_same_as_shipping: true,
        billing_address: {
            street_address: "",
            city: "",
            postal_code: "",
            country: "ES",
        },
        coupon_code: "",
        items: cart.items || [],
    };
}
