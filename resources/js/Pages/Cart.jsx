import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import CartStep from '@/Components/Checkout/CartStep';
import InfoStep from '@/Components/Checkout/InfoStep';
import ShippingStep from '@/Components/Checkout/ShippingStep';
import PaymentStep from '@/Components/Checkout/PaymentStep';
import Header from '@/Components/Common/Header';
import Footer from '@/Components/Common/Footer';

// Load Stripe outside of component to avoid recreation
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY || '');

function CheckoutContent({ cart, popularProducts, auth, stripeKey, nextStep, prevStep, step, subtotal, shippingCost, total }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const { data, setData, post, processing, transform, errors } = useForm({
        // Info Step
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        country: '',

        // Shipping Step
        shipping_method: 'standard',
        pickup_point_id: null,

        // Payment Step
        payment_method: 'card',
        payment_intent_id: null,
        billing_same_as_shipping: true,

        // Items
        items: cart.items || []
    });

    const handleSubmitOrder = async () => {
        if (!stripe || !elements) {
            console.error('Stripe not loaded');
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Create Payment Intent on backend
            const { data: intentData } = await axios.post(route('payment-intent.create'), {
                amount: cart.total,
            });

            // 2. Confirm payment on frontend
            const result = await stripe.confirmCardPayment(intentData.clientSecret, {
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
                            country: 'ES',
                        }
                    },
                },
            });

            if (result.error) {
                alert(result.error.message);
                setIsProcessing(false);
                return;
            }

            // 3. Payment successful, submit order to backend
            if (result.paymentIntent.status === 'succeeded') {
                transform((data) => ({
                    ...data,
                    payment_intent_id: result.paymentIntent.id,
                    shipping_address: {
                        full_name: `${data.first_name} ${data.last_name}`,
                        phone: data.phone,
                        street_address: data.address,
                        city: data.city,
                        postal_code: data.postal_code,
                        country: data.country,
                    }
                }));

                post(route('orders.store'), {
                    onFinish: () => setIsProcessing(false),
                });
            }
        } catch (error) {
            console.error('Order submission error:', error);
            alert('Hubo un error al procesar tu pedido. Por favor, inténtalo de nuevo.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="w-full">
            {step === 1 && (
                <CartStep
                    cart={cart}
                    onNext={nextStep}
                    popularProducts={popularProducts}
                />
            )}
            {step === 2 && (
                <InfoStep
                    data={data}
                    setData={setData}
                    onNext={nextStep}
                    onBack={prevStep}
                    user={auth.user}
                />
            )}
            {step === 3 && (
                <ShippingStep
                    data={data}
                    setData={setData}
                    onNext={nextStep}
                    onBack={prevStep}
                />
            )}
            {step === 4 && (
                <PaymentStep
                    data={data}
                    setData={setData}
                    onSubmit={handleSubmitOrder}
                    onBack={prevStep}
                    processing={processing || isProcessing}
                />
            )}
        </div>
    );
}

export default function Cart({ cart = { items: [], total: 0 }, auth = { user: null }, popularProducts = [], stripeKey }) {
    const finalStripePromise = stripeKey ? loadStripe(stripeKey) : stripePromise;
    const [step, setStep] = useState(1);

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    // Calculate dynamic totals
    const subtotal = parseFloat(cart.total);
    const shippingCost = 3.99;
    const total = subtotal + (step > 2 ? (step === 3 ? 0 : shippingCost) : 0);

    return (
        <Elements stripe={finalStripePromise}>
            <div className="min-h-screen flex flex-col bg-white">
                <Head title="Checkout - MiKiwi" />

                <Header user={auth.user} />

                <main className="flex-grow flex flex-col md:flex-row w-full max-w-screen-2xl mx-auto px-4 md:px-0 lg:px-0">
                    <div className="w-full md:w-3/5 border-r border-gray-100 p-6 md:p-12 lg:p-16">
                        {/* Progress Navigation */}
                        <div className="flex items-center space-x-2 text-sm mb-10 text-gray-400">
                            {['Carrito', 'Información', 'Envío', 'Pago'].map((label, index) => {
                                const stepNum = index + 1;
                                const isActive = step === stepNum;
                                const isCompleted = step > stepNum;
                                return (
                                    <React.Fragment key={label}>
                                        <div className="flex items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                                                ${isActive ? 'bg-primary text-white' : isCompleted ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                                                {stepNum}
                                            </div>
                                            <span className={`ml-2 text-xs mt-1 ${isActive ? 'text-primary font-bold' : isCompleted ? 'text-primary' : 'text-gray-500'}`}>{label}</span>
                                        </div>
                                        {index < 3 && <span className="mx-2 text-gray-300">&gt;</span>}
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        <CheckoutContent
                            cart={cart}
                            popularProducts={popularProducts}
                            auth={auth}
                            stripeKey={stripeKey}
                            nextStep={nextStep}
                            prevStep={prevStep}
                            step={step}
                            subtotal={subtotal}
                            shippingCost={shippingCost}
                            total={total}
                        />
                    </div>

                    {/* Right Column (2/5) - Persistent Basket Summary */}
                    <div className="w-full md:w-2/5 bg-gray-50 p-6 md:p-12 lg:p-16 h-auto">
                        <div className="sticky top-10">
                            <h3 className="text-2xl font-semibold mb-8 text-gray-800">Tu Cesta</h3>

                            <div className="space-y-6 mb-8 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                                {cart.items && cart.items.length > 0 ? (
                                    cart.items.map((item) => (
                                        <div key={item.product_id} className="flex gap-4 items-center">
                                            <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
                                                <img
                                                    src={(() => {
                                                        try {
                                                            const images = typeof item.product.images === 'string'
                                                                ? JSON.parse(item.product.images)
                                                                : item.product.images;
                                                            return Array.isArray(images) && images.length > 0 ? images[0] : 'https://via.placeholder.com/150';
                                                        } catch (e) {
                                                            return 'https://via.placeholder.com/150';
                                                        }
                                                    })()}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                <span className="absolute -top-1 -right-1 bg-gray-800 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-gray-900 leading-tight">{item.product.name}</h4>
                                                <p className="text-xs text-gray-400 mt-1 uppercase tracking-tighter">REF: {item.product.sku || 'N/A'}</p>
                                            </div>
                                            <div className="text-sm font-semibold text-gray-900">
                                                {(item.product.base_price * item.quantity).toFixed(2)} €
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-sm italic">Tu cesta está vacía ahora mismo.</p>
                                )}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-gray-200">
                                <div className="flex justify-between text-gray-600">
                                    <span className="text-sm">Subtotal</span>
                                    <span className="font-medium">{subtotal.toFixed(2)} €</span>
                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span className="text-sm">Envío</span>
                                    <span className="font-medium">
                                        {step > 2 ? `${shippingCost.toFixed(2)} €` : 'Gratis'}
                                    </span>
                                </div>

                                <div className="flex justify-between items-baseline pt-6 border-t border-gray-200 mt-4">
                                    <div>
                                        <span className="text-xl font-bold text-gray-900">Total</span>
                                        <p className="text-[10px] text-gray-400 uppercase font-semibold">Incluye IVA</p>
                                    </div>
                                    <span className="text-3xl font-extrabold text-primary">
                                        {total.toFixed(2)} €
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </Elements>
    );
}
