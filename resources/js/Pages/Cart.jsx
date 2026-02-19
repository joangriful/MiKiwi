import React, { lazy, Suspense, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import CartStep from '@/Components/Checkout/CartStep';
import InfoStep from '@/Components/Checkout/InfoStep';
import ShippingStep from '@/Components/Checkout/ShippingStep';
import Header from '@/Components/Common/Header';
import Footer from '@/Components/Common/Footer';
import { optimizeImageUrl } from '@/Utils/imageUrl';

const PaymentWithStripe = lazy(() => import('@/Components/Checkout/PaymentWithStripe'));

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
    stripeKey,
    total,
}) {
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
                <Suspense fallback={null}>
                    <PaymentWithStripe
                        stripeKey={stripeKey}
                        formData={formData}
                        setFormData={setFormData}
                        onBack={prevStep}
                        formPost={formPost}
                        formTransform={formTransform}
                        formProcessing={formProcessing}
                        total={total}
                        cart={cart}
                    />
                </Suspense>
            )}
        </div>
    );
}

export default function Cart({ cart = { items: [], total: 0 }, auth = { user: null }, popularProducts = [], stripeKey, coupon }) {
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
                            stripeKey={stripeKey}
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
                                                    src={optimizeImageUrl((() => {
                                                        try {
                                                            const images = typeof item.product.images === 'string'
                                                                ? JSON.parse(item.product.images)
                                                                : item.product.images;
                                                            return Array.isArray(images) && images.length > 0 ? images[0] : 'https://via.placeholder.com/150';
                                                        } catch (e) {
                                                            return 'https://via.placeholder.com/150';
                                                        }
                                                    })(), { width: 300, height: 300 })}
                                                    alt={item.product.name}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="w-full h-full object-cover"
                                                />
                                                <span className="absolute -top-1 -right-1 bg-gray-800 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleRemoveItem(item.product_id)}
                                                    className="absolute bottom-0 right-0 bg-red-500 text-white p-1 rounded-tl-lg hover:bg-red-600 transition-colors"
                                                    title="Eliminar del carrito"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
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

                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <label className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 block">CUPÓN DE DESCUENTO</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Código del cupón"
                                        className="flex-1 text-sm border-gray-200 rounded-lg focus:ring-primary focus:border-primary"
                                        value={data.coupon_code}
                                        onChange={(e) => setData('coupon_code', e.target.value)}
                                    />
                                    <button
                                        onClick={applyCoupon}
                                        className="px-4 py-2 bg-gray-800 text-white text-xs font-bold rounded-lg hover:bg-gray-700 transition-all"
                                    >
                                        Aplicar
                                    </button>
                                </div>
                                {coupon && (
                                    <div className="mt-3 flex justify-between items-center bg-green-50 p-2 rounded-lg border border-green-100">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-green-700">{coupon.code}</span>
                                            <span className="text-[10px] text-green-600">(-{coupon.type === 'percent' ? `${coupon.value}%` : `${coupon.value} €`})</span>
                                        </div>
                                        <button onClick={removeCoupon} className="text-red-500 hover:text-red-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-gray-200 mt-6">
                                <div className="flex justify-between text-gray-600">
                                    <span className="text-sm">Subtotal</span>
                                    <span className="font-medium">{subtotal.toFixed(2)} €</span>
                                </div>

                                {coupon && (
                                    <div className="flex justify-between text-green-600 font-medium">
                                        <span className="text-sm">Descuento ({coupon.code})</span>
                                        <span>-{coupon.discount.toFixed(2)} €</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-gray-600">
                                    <span className="text-sm">Envío</span>
                                    <span className="font-medium">
                                        {step > 2 ? `${shippingCost.toFixed(2)} €` : 'Calculado en el siguiente paso'}
                                    </span>
                                </div>

                                <div className="flex justify-between items-baseline pt-6 border-t border-gray-200 mt-4">
                                    <div>
                                        <span className="text-xl font-bold text-gray-900">Total</span>
                                        <p className="text-[10px] text-gray-400 uppercase font-semibold">Incluye IVA</p>
                                    </div>
                                    <span className="text-3xl font-extrabold text-primary">
                                        {(total - (coupon ? coupon.discount : 0)).toFixed(2)} €
                                    </span>
                                </div>

                                {step === 1 && (
                                    <button
                                        onClick={nextStep}
                                        className="w-full mt-6 px-12 py-4 bg-primary text-white font-black rounded-xl hover:bg-primary-dark shadow-xl shadow-green-100 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 text-lg"
                                    >
                                        Pagar Pedido
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
    );
}
