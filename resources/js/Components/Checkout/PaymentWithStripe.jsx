import { useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import PaymentStep from '@/Components/Checkout/PaymentStep';

function PaymentContent({
    stripeKey,
    formData,
    setFormData,
    onBack,
    formPost,
    formTransform,
    formProcessing,
    total,
    cart,
}) {
    const stripe = useStripe();
    const elements = useElements();
    const [isInternalProcessing, setIsInternalProcessing] = useState(false);

    const handleSubmitOrder = async () => {
        if (!stripe || !elements) {
            return;
        }

        setIsInternalProcessing(true);

        try {
            const dynamicTotal = total - (formData.coupon_code && cart.coupon ? cart.coupon.discount : 0);

            const { data: intentData } = await axios.post(route('payment-intent.create'), {
                amount: Math.round(dynamicTotal * 100) / 100,
            });

            const result = await stripe.confirmCardPayment(intentData.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: `${formData.first_name} ${formData.last_name}`,
                        email: formData.email,
                        phone: formData.phone,
                        address: {
                            line1: formData.address,
                            city: formData.city,
                            postal_code: formData.postal_code,
                            country: 'ES',
                        },
                    },
                },
            });

            if (result.error) {
                setIsInternalProcessing(false);
                return;
            }

            if (result.paymentIntent.status === 'succeeded') {
                formTransform((data) => ({
                    ...data,
                    payment_intent_id: result.paymentIntent.id,
                    shipping_address: {
                        full_name: `${data.first_name} ${data.last_name}`,
                        phone: data.phone,
                        street_address: data.address,
                        city: data.city,
                        postal_code: data.postal_code,
                        country: data.country,
                    },
                    dni: data.dni,
                    billing_address: data.billing_same_as_shipping
                        ? null
                        : {
                              full_name: `${data.first_name} ${data.last_name}`,
                              phone: data.phone,
                              street_address: data.billing_address.address,
                              city: data.billing_address.city,
                              postal_code: data.billing_address.postal_code,
                              country: data.billing_address.country,
                          },
                }));

                formPost(route('orders.store'), {
                    onFinish: () => setIsInternalProcessing(false),
                });
            }
        } catch (error) {
            setIsInternalProcessing(false);
        }
    };

    return (
        <PaymentStep
            data={formData}
            setData={setFormData}
            onSubmit={handleSubmitOrder}
            onBack={onBack}
            processing={formProcessing || isInternalProcessing}
        />
    );
}

export default function PaymentWithStripe(props) {
    const resolvedStripeKey = props.stripeKey || import.meta.env.VITE_STRIPE_KEY || '';
    const stripePromise = useMemo(() => {
        if (!resolvedStripeKey) {
            return null;
        }
        return loadStripe(resolvedStripeKey);
    }, [resolvedStripeKey]);

    if (!stripePromise) {
        return null;
    }

    return (
        <Elements stripe={stripePromise}>
            <PaymentContent {...props} />
        </Elements>
    );
}
