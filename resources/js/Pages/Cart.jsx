import React, { useState, useEffect, useMemo } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
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

function CheckoutContent({
    cart,
    auth,
    step,
    nextStep,
    prevStep,
    formData,
    setFormData,
    formPost,
    formProcessing,
    formTransform,
    formErrors,
    popularProducts,
    total
}) {
    const stripe = useStripe();
    const elements = useElements();
    const [isInternalProcessing, setIsInternalProcessing] = useState(false);

    const handleSubmitOrder = async () => {
        if (!stripe) {
            console.error('Stripe not loaded');
            return;
        }

        setIsInternalProcessing(true);

        try {
            // 1. Create Payment Intent on backend
            const dynamicTotal = total - (formData.coupon_code && cart.coupon ? cart.coupon.discount : 0);

            const { data: intentData } = await axios.post(route('payment-intent.create'), {
                amount: Math.round(dynamicTotal * 100) / 100,
            });

            // 2. Confirm payment on frontend with Stripe
            const confirmData = {
                payment_method: formData.selected_payment_method
                    ? (formData.selected_payment_method.startsWith('tok_')
                        ? { card: { token: formData.selected_payment_method } }
                        : formData.selected_payment_method)
                    : {
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
                            }
                        },
                    },
            };

            const result = await stripe.confirmCardPayment(intentData.clientSecret, confirmData);

            if (result.error) {
                alert(result.error.message);
                setIsInternalProcessing(false);
                return;
            }

            // 3. Payment done – build the order payload and submit to backend using router.post
            if (result.paymentIntent.status === 'succeeded') {
                const orderPayload = {
                    payment_intent_id: result.paymentIntent.id,
                    payment_method: formData.payment_method || 'card',
                    pickup_point_id: formData.pickup_point_id || null,
                    shipping_method: formData.shipping_method,
                    shipping_address: {
                        full_name: `${formData.first_name} ${formData.last_name}`,
                        phone: formData.phone,
                        street_address: formData.address,
                        city: formData.city,
                        postal_code: formData.postal_code,
                        country: formData.country || 'España',
                        email: formData.email,
                    },
                    billing_address: formData.billing_same_as_shipping ? null : {
                        full_name: `${formData.first_name} ${formData.last_name}`,
                        phone: formData.phone,
                        street_address: formData.billing_address?.address,
                        city: formData.billing_address?.city,
                        postal_code: formData.billing_address?.postal_code,
                        country: formData.billing_address?.country || 'España',
                    },
                    notes: formData.notes || null,
                };

                // router.post handles CSRF automatically and redirects on success
                router.post(route('orders.store'), orderPayload, {
                    onFinish: () => setIsInternalProcessing(false),
                    onError: (errors) => {
                        console.error('Order store errors:', errors);
                        alert('Hubo un error al guardar tu pedido. Contacta con soporte con tu referencia de pago: ' + result.paymentIntent.id);
                        setIsInternalProcessing(false);
                    },
                });
            }
        } catch (error) {
            console.error('Order submission error:', error);
            const message = error?.response?.data?.message || error.message || 'Error desconocido';
            alert(`Hubo un error al procesar tu pedido: ${message}`);
            setIsInternalProcessing(false);
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
                    data={formData}
                    setData={setFormData}
                    onNext={nextStep}
                    onBack={prevStep}
                    user={auth.user}
                    errors={formErrors}
                />
            )}
            {step === 3 && (
                <ShippingStep
                    data={formData}
                    setData={setFormData}
                    onNext={nextStep}
                    onBack={prevStep}
                />
            )}
            {step === 4 && (
                <PaymentStep
                    data={formData}
                    setData={setFormData}
                    auth={auth}
                    onSubmit={handleSubmitOrder}
                    onBack={prevStep}
                    processing={formProcessing || isInternalProcessing}
                />
            )}
        </div>
    );
}

export default function Cart({ cart = { items: [], total: 0 }, auth = { user: null }, popularProducts = [], stripeKey, coupon, isBuyNow }) {
    console.log('Cart received stripeKey:', stripeKey);
    const finalStripePromise = useMemo(() => {
        return stripeKey ? loadStripe(stripeKey) : stripePromise;
    }, [stripeKey]);
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, transform, errors, delete: destroy } = useForm({
        // Info Step
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        dni: '',
        address: '',
        city: '',
        postal_code: '',
        country: 'España',

        // Shipping Step
        shipping_method: 'standard',
        pickup_point_id: null,

        // Payment Step
        payment_method: 'card',
        selected_payment_method: null,
        payment_intent_id: null,
        billing_same_as_shipping: true,
        billing_address: {
            address: '',
            city: '',
            postal_code: '',
            country: 'España',
        },

        // Coupon
        coupon_code: '',

        // Items
        items: cart.items || []
    });

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const applyCoupon = () => {
        post(route('cart.coupon.apply'), {
            preserveScroll: true,
            onSuccess: () => setData('coupon_code', ''),
        });
    };

    const removeCoupon = () => {
        destroy(route('cart.coupon.remove'), {
            preserveScroll: true,
        });
    };

    const handleRemoveItem = (itemId) => {
        destroy(route('cart.remove', itemId), {
            preserveScroll: true,
        });
    };

    // Calculate dynamic totals
    const shippingCosts = {
        standard: 3.99,
        pickup: 2.99
    };
    const subtotal = parseFloat(cart.total);
    const shippingCost = shippingCosts[data.shipping_method] || 0;

    // The total should show the shipping cost only if we've reached the shipping step (3) or payment (4)
    // Actually, users expect to see the total including shipping as soon as they select it.
    const total = subtotal + (step >= 3 ? shippingCost : 0);

    return (
        <Elements stripe={finalStripePromise}>
            <div className="min-h-screen flex flex-col bg-white">
                <Head title="Checkout - MiKiwi" />
                <Header user={auth.user} />

                <main className="flex-grow flex flex-col md:flex-row w-full max-w-screen-2xl mx-auto px-4 md:px-0 lg:px-0">
                    <div className="w-full md:w-3/5 p-6 md:p-12 lg:p-16 bg-white">
                        {/* Progress Navigation */}
                        <div className="flex items-center justify-between overflow-x-auto pb-4 mb-12 no-scrollbar">
                            {['Carrito', 'Información', 'Envío', 'Pago'].map((label, index) => {
                                const stepNum = index + 1;
                                const isActive = step === stepNum;
                                const isCompleted = step > stepNum;
                                return (
                                    <React.Fragment key={label}>
                                        <div className="flex flex-col items-center min-w-fit px-2">
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-500 shadow-sm
                                                ${isActive ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : isCompleted ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                                                {isCompleted ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : stepNum}
                                            </div>
                                            <span className={`mt-3 text-[10px] uppercase tracking-widest font-black transition-colors duration-300 ${isActive ? 'text-primary' : isCompleted ? 'text-gray-900' : 'text-gray-300'}`}>{label}</span>
                                        </div>
                                        {index < 3 && (
                                            <div className="flex-grow mx-4 h-[2px] bg-gray-100 min-w-[20px] max-w-[60px] self-center -mt-6">
                                                <div className={`h-full bg-primary transition-all duration-700 ease-out`} style={{ width: step > stepNum ? '100%' : '0%' }}></div>
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        <CheckoutContent
                            cart={cart}
                            auth={auth}
                            step={step}
                            nextStep={nextStep}
                            prevStep={prevStep}
                            formData={data}
                            setFormData={setData}
                            formPost={post}
                            formProcessing={processing}
                            formTransform={transform}
                            formErrors={errors}
                            popularProducts={popularProducts}
                            total={total}
                        />
                    </div>

                    {/* Right Column (2/5) - Persistent Basket Summary */}
                    <div className="w-full md:w-2/5 bg-[#fcfaf7] p-6 md:p-12 lg:p-16 border-l border-gray-100">
                        <div className="sticky top-10">
                            <div className="flex justify-between items-end mb-10">
                                <div>
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">Tu Pedido</h3>
                                    <div className="w-12 h-1 bg-primary mt-2 rounded-full"></div>
                                </div>
                                {isBuyNow && (
                                    <Link
                                        href={route('cart.index')}
                                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-dark transition-colors"
                                    >
                                        Editar Cesta
                                    </Link>
                                )}
                            </div>

                            <div className="space-y-6 mb-10 max-h-[45vh] overflow-y-auto pr-4 custom-scrollbar">
                                {cart.items && cart.items.length > 0 ? (
                                    cart.items.map((item) => (
                                        <div key={item.product_id} className="flex gap-5 items-center group">
                                            <Link href={route('products.show', item.product.slug)} className="relative w-20 h-20 flex-shrink-0 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm group-hover:shadow-md group-hover:border-primary/20 transition-all duration-300 block">
                                                <img
                                                    src={(() => {
                                                        try {
                                                            const images = typeof item.product.images === 'string'
                                                                ? JSON.parse(item.product.images)
                                                                : item.product.images;
                                                            if (Array.isArray(images) && images.length > 0) {
                                                                return images[0];
                                                            }
                                                            return item.product.image_url || 'https://via.placeholder.com/150';
                                                        } catch (e) {
                                                            return item.product.image_url || 'https://via.placeholder.com/150';
                                                        }
                                                    })()}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-lg font-black shadow-lg shadow-primary/20">
                                                    {item.quantity}
                                                </span>
                                            </Link>
                                            <div className="flex-1">
                                                <Link href={route('products.show', item.product.slug)} className="text-sm font-bold text-gray-900 leading-snug hover:text-primary transition-colors block">
                                                    {item.product.name}
                                                </Link>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <p className="text-[10px] text-gray-300 font-extrabold uppercase tracking-widest">REF: {item.product.sku || 'N/A'}</p>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleRemoveItem(item.product_id);
                                                        }}
                                                        className="text-[10px] font-black uppercase text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"
                                                    >
                                                        Quitar
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-sm font-black text-gray-900">
                                                {(item.product.base_price * item.quantity).toFixed(2)} €
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Carrito vacío</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-10 pt-10 border-t border-gray-100">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-3 block px-1">CUPÓN DE DESCUENTO</label>
                                <div className="flex gap-3 bg-white p-2 rounded-2xl border border-gray-100 focus-within:border-primary/30 transition-all shadow-sm">
                                    <input
                                        type="text"
                                        placeholder="Tengo un código..."
                                        className="flex-1 text-xs border-none bg-transparent focus:ring-0 font-bold placeholder:text-gray-300 uppercase tracking-widest"
                                        value={data.coupon_code}
                                        onChange={(e) => setData('coupon_code', e.target.value)}
                                    />
                                    <button
                                        onClick={applyCoupon}
                                        className="px-6 py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
                                    >
                                        Validar
                                    </button>
                                </div>
                                {coupon && (
                                    <div className="mt-4 flex justify-between items-center bg-primary/5 p-4 rounded-2xl border border-primary/10 animate-in zoom-in-95 duration-300">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <div>
                                                <span className="text-xs font-black text-gray-900 block">{coupon.code}</span>
                                                <span className="text-[10px] text-primary font-bold uppercase tracking-tighter">Descuento aplicado (-{coupon.type === 'percent' ? `${coupon.value}%` : `${coupon.value} €`})</span>
                                            </div>
                                        </div>
                                        <button onClick={removeCoupon} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 pt-10 border-t border-gray-100 mt-10">
                                <div className="flex justify-between px-1">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subtotal</span>
                                    <span className="text-sm font-black text-gray-900">{subtotal.toFixed(2)} €</span>
                                </div>

                                {coupon && (
                                    <div className="flex justify-between px-1">
                                        <span className="text-xs font-bold text-primary uppercase tracking-widest text-[10px]">Ahorro cupón</span>
                                        <span className="text-sm font-black text-primary">-{coupon.discount.toFixed(2)} €</span>
                                    </div>
                                )}

                                <div className="flex justify-between px-1">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Gastos Envío</span>
                                    <span className="text-sm font-black text-gray-900">
                                        {step > 2 ? `${shippingCost.toFixed(2)} €` : <span className="text-[10px] text-gray-300 italic lowercase tracking-normal">pendiente de envío</span>}
                                    </span>
                                </div>

                                <div className="flex justify-between items-end pt-10 border-t border-gray-100 mt-6 px-1">
                                    <div>
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Total Final</span>
                                        <p className="text-[10px] text-gray-300 uppercase font-bold mt-1">IVA Incluido</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-4xl font-black text-primary tracking-tighter">
                                            {(total - (coupon ? coupon.discount : 0)).toFixed(2)}<span className="text-xl ml-1">€</span>
                                        </span>
                                    </div>
                                </div>

                                {step === 1 && (
                                    <button
                                        onClick={nextStep}
                                        className="group relative w-full mt-10 px-12 py-5 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark shadow-2xl shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 text-lg overflow-hidden"
                                    >
                                        <div className="relative z-10 flex items-center justify-center gap-3">
                                            <span>PAGAR AHORA</span>
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </div>
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </Elements>
    );
}
