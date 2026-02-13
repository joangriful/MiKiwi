import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import InputLabel from '@/Components/InputLabel';

export default function PaymentStep({ data, setData, onSubmit, onBack, processing }) {
    const stripe = useStripe();
    const elements = useElements();
    const [cardError, setCardError] = useState(null);
    const [isConfirming, setIsConfirming] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsConfirming(true);
        setCardError(null);

        // This function will be called by Cart.jsx handleSubmitOrder
        // But we can also handle it here if we want to pass the intent back
        onSubmit();
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#1f2937',
                '::placeholder': {
                    color: '#9ca3af',
                },
            },
            invalid: {
                color: '#ef4444',
            },
        },
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">4. Método de Pago</h2>
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider">Pago 100% Seguro</span>
                </div>
            </div>

            <p className="text-sm text-gray-500 mb-6">
                Todas las transacciones están encriptadas y son seguras. MiKiwi nunca almacena los datos completos de tu tarjeta.
            </p>

            <div className="space-y-4">
                {/* Stripe Card Container */}
                <div className="relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl pointer-events-none"></div>
                    <div className="relative border-2 border-primary/20 p-6 rounded-2xl bg-white shadow-sm transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-md">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <span className="font-bold text-gray-900 text-lg">Tarjeta Bancaria</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 grayscale hover:grayscale-0 transition-all opacity-60" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 grayscale hover:grayscale-0 transition-all opacity-60" />
                                <div className="w-[1px] h-4 bg-gray-200 mx-2"></div>
                                <span className="text-[10px] font-bold text-gray-400">AMEX, JCB...</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${cardError ? 'border-red-200 bg-red-50/30' : 'border-gray-100 bg-gray-50/50 focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/5'}`}>
                                <InputLabel value="Número de Tarjeta, Fecha y CVC" className="mb-3 text-[10px] uppercase tracking-[0.2em] font-black text-gray-400" />
                                <div className="px-1 py-1">
                                    <CardElement options={cardElementOptions} onChange={(e) => setCardError(e.error ? e.error.message : null)} />
                                </div>
                            </div>

                            {cardError && (
                                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 animate-in slide-in-from-left-2 duration-300">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-bold">{cardError}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Coming Soon Options */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="border border-gray-100 p-4 rounded-xl flex items-center bg-gray-50/50 opacity-60 grayscale cursor-not-allowed">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 mr-3" />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Próximamente</span>
                    </div>
                    <div className="border border-gray-100 p-4 rounded-xl flex items-center bg-gray-50/50 opacity-60 grayscale cursor-not-allowed">
                        <div className="flex gap-2 mr-3">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className="h-4" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className="h-4" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Próximamente</span>
                    </div>
                </div>
            </div>

            {/* Billing Address Toggle */}
            <div className={`mt-8 p-1 rounded-2xl border-2 transition-all duration-300 ${data.billing_same_as_shipping ? 'border-gray-100 bg-gray-50/30' : 'border-primary/20 bg-primary/5'}`}>
                <div className="p-5 flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            type="checkbox"
                            id="billing"
                            checked={data.billing_same_as_shipping}
                            onChange={(e) => setData('billing_same_as_shipping', e.target.checked)}
                            className="text-primary rounded-lg focus:ring-primary h-6 w-6 border-gray-300 cursor-pointer transition-all hover:scale-110"
                        />
                    </div>
                    <div className="ml-4 flex flex-col cursor-pointer" onClick={() => setData('billing_same_as_shipping', !data.billing_same_as_shipping)}>
                        <label htmlFor="billing" className="text-sm text-gray-900 font-black cursor-pointer uppercase tracking-tight">
                            Dirección de facturación idéntica
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                            Usa mis datos de envío para la factura. Desmarca si necesitas otra dirección.
                        </p>
                    </div>
                </div>

                {!data.billing_same_as_shipping && (
                    <div className="p-6 bg-white rounded-xl border border-gray-100 space-y-4 m-2 animate-in slide-in-from-top-4 duration-500 shadow-inner">
                        <h4 className="font-black text-gray-900 text-xs uppercase tracking-widest mb-4 flex items-center">
                            <span className="w-6 h-[2px] bg-primary mr-2"></span>
                            Datos de Facturación
                        </h4>
                        <div>
                            <InputLabel htmlFor="billing_address" value="Dirección Completa" />
                            <input
                                id="billing_address"
                                type="text"
                                value={data.billing_address.address}
                                onChange={(e) => setData('billing_address', { ...data.billing_address, address: e.target.value })}
                                className="mt-1 block w-full border-gray-200 rounded-xl shadow-sm focus:ring-primary focus:border-primary sm:text-sm h-12"
                                placeholder="Calle, número, portal..."
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="billing_city" value="Ciudad" />
                                <input
                                    id="billing_city"
                                    type="text"
                                    value={data.billing_address.city}
                                    onChange={(e) => setData('billing_address', { ...data.billing_address, city: e.target.value })}
                                    className="mt-1 block w-full border-gray-200 rounded-xl shadow-sm focus:ring-primary focus:border-primary sm:text-sm h-12"
                                    placeholder="Ej: Madrid"
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="billing_postal_code" value="Código Postal" />
                                <input
                                    id="billing_postal_code"
                                    type="text"
                                    value={data.billing_address.postal_code}
                                    onChange={(e) => setData('billing_address', { ...data.billing_address, postal_code: e.target.value })}
                                    className="mt-1 block w-full border-gray-200 rounded-xl shadow-sm focus:ring-primary focus:border-primary sm:text-sm h-12"
                                    placeholder="28001"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Final Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center px-6 py-3 rounded-xl border-2 border-gray-100 text-gray-400 hover:text-primary hover:border-primary/20 transition-all duration-300 font-bold text-xs uppercase tracking-widest order-2 md:order-1"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver a Envío
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={processing || isConfirming || !stripe}
                    className="relative px-12 py-5 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark shadow-2xl shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 text-xl w-full md:w-auto order-1 md:order-2 overflow-hidden flex items-center justify-center min-w-[280px]"
                >
                    <div className="relative z-10 flex items-center">
                        {processing || isConfirming ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3"></div>
                                <span>PROCESANDO...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>PAGAR AHORA</span>
                            </>
                        )}
                    </div>
                </button>
            </div>

            <div className="flex flex-col items-center space-y-4 mt-8 pt-8 border-t border-gray-50">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center grayscale opacity-40 hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                        </svg>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">SSL Encrypted</span>
                    </div>
                    <div className="flex items-center grayscale opacity-40 hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                        </svg>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">PCI Compliant</span>
                    </div>
                </div>
                <p className="text-[10px] text-center text-gray-400 max-w-sm leading-relaxed font-medium">
                    MiKiwi es un entorno de comercio electrónico seguro. Puedes cancelar tu suscripción o pedir un reembolso en un plazo de 14 días.
                </p>
            </div>
        </div>
    );
}
