import { useState } from "react";
import { router } from "@inertiajs/react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import CartStep from "@/Components/Checkout/CartStep/CartStep";
import InfoStep from "@/Components/Checkout/InfoStep/InfoStep";
import PaymentStep from "@/Components/Checkout/PaymentStep/PaymentStep";
import ShippingStep from "@/Components/Checkout/ShippingStep/ShippingStep";
import { normalizeApiError, normalizeInertiaErrors, normalizeStripeError } from "@/Utils/httpError";
import styles from "./CheckoutStepRenderer.module.css";

export default function CheckoutStepRenderer({
    cart,
    auth,
    step,
    nextStep,
    prevStep,
    form,
    popularProducts,
    finalTotal,
}) {
    const stripe = useStripe();
    const elements = useElements();
    const [isInternalProcessing, setIsInternalProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

    const handleSubmitOrder = async () => {
        if (!stripe) {
            setPaymentError({
                title: "Pago seguro no disponible",
                message: "Todavía estamos preparando el pago seguro. Espera un momento y vuelve a intentarlo.",
                code: "stripe_not_ready",
                fieldErrors: null,
            });
            return;
        }

        setPaymentError(null);
        setIsInternalProcessing(true);

        try {
            const isSavedMethod = !!form.data.selected_payment_method;
            const isTestToken = form.data.selected_payment_method?.startsWith("tok_");

            const { data: intentData } = await axios.post(route("payment-intent.create"), {
                amount: Math.round(finalTotal * 100) / 100,
                save_card: !isSavedMethod && !isTestToken,
            });

            const result = await stripe.confirmCardPayment(
                intentData.clientSecret,
                buildConfirmPaymentData(form.data, elements),
            );

            if (result.error) {
                setPaymentError(normalizeStripeError(result.error, {
                    title: "No pudimos validar el pago",
                    message: "No pudimos validar la información de tu tarjeta. Revisa los datos e inténtalo de nuevo.",
                    code: "checkout_payment_failed",
                }));
                setIsInternalProcessing(false);
                return;
            }

            if (result.paymentIntent.status === "succeeded") {
                router.post(route("orders.store"), buildOrderPayload(form.data, result.paymentIntent.id), {
                    onFinish: () => setIsInternalProcessing(false),
                    onSuccess: () => setPaymentError(null),
                    onError: (errors) => {
                        setPaymentError(normalizeInertiaErrors(errors, {
                            title: "No pudimos finalizar tu pedido",
                            message: `No pudimos guardar tu pedido. Si el cargo se ha realizado, contacta con soporte con la referencia ${result.paymentIntent.id}.`,
                            code: "order_creation_failed",
                        }));
                        setIsInternalProcessing(false);
                    },
                });
            }
        } catch (error) {
            setPaymentError(normalizeApiError(error, {
                title: "No pudimos procesar el pago",
                message: "No pudimos procesar tu pedido. Revisa los datos e inténtalo de nuevo.",
                code: "checkout_payment_failed",
            }));
            setIsInternalProcessing(false);
        }
    };

    return (
        <div className={styles.root}>
            {step === 1 ? (
                <CartStep cart={cart} onNext={nextStep} popularProducts={popularProducts} />
            ) : null}

            {step === 2 ? (
                <InfoStep
                    data={form.data}
                    setData={form.setData}
                    onNext={nextStep}
                    onBack={prevStep}
                    user={auth.user}
                    errors={form.errors}
                />
            ) : null}

            {step === 3 ? (
                <ShippingStep data={form.data} setData={form.setData} onNext={nextStep} onBack={prevStep} />
            ) : null}

            {step === 4 ? (
                <PaymentStep
                    data={form.data}
                    setData={form.setData}
                    auth={auth}
                    onSubmit={handleSubmitOrder}
                    onBack={prevStep}
                    processing={form.processing || isInternalProcessing}
                    submitError={paymentError}
                    onClearSubmitError={() => setPaymentError(null)}
                />
            ) : null}
        </div>
    );
}

function buildConfirmPaymentData(data, elements) {
    if (data.selected_payment_method) {
        return {
            payment_method: data.selected_payment_method.startsWith("tok_")
                ? { card: { token: data.selected_payment_method } }
                : data.selected_payment_method,
        };
    }

    return {
        payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
                name: `${data.first_name} ${data.last_name}`,
                email: data.email,
                phone: data.phone,
                address: {
                    line1: data.address,
                    city: data.city,
                    postal_code: data.postal_code,
                    country: "ES",
                },
            },
        },
    };
}

function buildOrderPayload(data, paymentIntentId) {
    return {
        payment_intent_id: paymentIntentId,
        payment_method: data.payment_method || "stripe",
        pickup_point_id: data.pickup_point_id || null,
        shipping_method: data.shipping_method,
        shipping_address: {
            full_name: `${data.first_name} ${data.last_name}`,
            phone: data.phone,
            street_address: data.address,
            city: data.city,
            postal_code: data.postal_code,
            country: data.country || "España",
            email: data.email,
        },
        billing_address: data.billing_same_as_shipping
            ? null
            : {
                  full_name: `${data.first_name} ${data.last_name}`,
                  phone: data.phone,
                  street_address: data.billing_address?.address,
                  city: data.billing_address?.city,
                  postal_code: data.billing_address?.postal_code,
                  country: data.billing_address?.country || "España",
              },
        notes: data.notes || null,
    };
}
