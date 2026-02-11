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
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">4. Pago Seguro</h2>

            <div className="space-y-4 mb-6">
                <div className="border p-4 rounded-xl bg-gray-50 bg-opacity-50">
                    <div className="flex items-center mb-6">
                        <div className="w-5 h-5 rounded-full border-4 border-primary bg-white mr-3"></div>
                        <span className="font-bold text-gray-900">Tarjeta de Crédito / Débito</span>
                    </div>

                    <div className="space-y-4 px-4 pb-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all min-h-[60px]">
                            <InputLabel value="Detalles de la tarjeta" className="mb-3 text-xs uppercase tracking-widest font-bold text-gray-400" />
                            <div className="py-2">
                                <CardElement
                                    options={cardElementOptions}
                                    onChange={(e) => setCardError(e.error ? e.error.message : null)}
                                />
                            </div>
                        </div>

                        {cardError && (
                            <div className="text-red-500 text-sm font-medium mt-2 bg-red-50 p-3 rounded-lg border border-red-100">
                                {cardError}
                            </div>
                        )}

                        <div className="flex items-center gap-4 mt-4">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-50" />
                        </div>
                    </div>
                </div>

                <div className="border p-4 rounded-xl flex items-center bg-gray-50 opacity-50 border-gray-100">
                    <div className="w-5 h-5 rounded-full border border-gray-300 mr-3"></div>
                    <span className="text-gray-500 font-medium">Apple Pay / Google Pay (Próximamente)</span>
                </div>
            </div>

            <div className="flex items-center mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <input
                    type="checkbox"
                    id="billing"
                    checked={data.billing_same_as_shipping}
                    onChange={(e) => setData('billing_same_as_shipping', e.target.checked)}
                    className="mr-3 text-primary rounded focus:ring-primary h-5 w-5 border-gray-300"
                />
                <label htmlFor="billing" className="text-sm text-gray-700 font-medium cursor-pointer">
                    Mi dirección de facturación es la misma que la de envío
                </label>
            </div>

            {!data.billing_same_as_shipping && (
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h4 className="font-bold text-gray-900 mb-2">Detalles de Facturación</h4>
                    <div>
                        <InputLabel htmlFor="billing_address" value="Dirección" />
                        <input
                            id="billing_address"
                            type="text"
                            value={data.billing_address.address}
                            onChange={(e) => setData('billing_address', { ...data.billing_address, address: e.target.value })}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
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
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
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
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                                required
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                <button type="button" onClick={onBack} className="text-primary hover:text-primary-dark font-bold text-sm uppercase tracking-widest order-2 md:order-1">
                    &lt; Volver a Envío
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={processing || isConfirming || !stripe}
                    className="px-12 py-4 bg-primary text-white font-black rounded-xl hover:bg-primary-dark shadow-xl shadow-green-100 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 text-lg w-full md:w-auto order-1 md:order-2"
                >
                    {processing || isConfirming ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Procesando...
                        </div>
                    ) : 'Confirmar y Pagar'}
                </button>
            </div>

            <p className="text-[10px] text-center text-gray-400 mt-4 leading-relaxed">
                Tus pagos se procesan de forma segura a través de Stripe. <br />
                MiKiwi no almacena los datos de tu tarjeta de crédito.
            </p>
        </div>
    );
}
