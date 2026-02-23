import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import InputLabel from '@/Components/InputLabel';

export default function PaymentStep({ data, setData, auth, onSubmit, onBack, processing }) {
    const isAdmin = auth?.user?.role === 'admin';
    const stripe = useStripe();
    const elements = useElements();
    const [cardError, setCardError] = useState(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [savedCards, setSavedCards] = useState([]);
    const [isLoadingCards, setIsLoadingCards] = useState(false);
    const [paymentOption, setPaymentOption] = useState('new'); // 'new' or card ID

    useEffect(() => {
        if (!processing) {
            setIsConfirming(false);
        }
    }, [processing]);

    useEffect(() => {
        if (auth?.user) {
            fetchSavedCards();
        }
    }, [auth?.user]);

    const fetchSavedCards = async () => {
        setIsLoadingCards(true);
        try {
            const { data: cards } = await axios.get(route('payment-methods.index'));
            setSavedCards(cards);
            if (cards.length > 0) {
                setPaymentOption(cards[0].id);
                setData('selected_payment_method', cards[0].id);
            } else if (isAdmin) {
                // For admins with no saved cards, auto-select the first test card
                setPaymentOption(TEST_CARDS[0].id);
                setData('selected_payment_method', TEST_CARDS[0].id);
            }
        } catch (err) {
            console.error('Error fetching saved cards:', err);
        } finally {
            setIsLoadingCards(false);
        }
    };

    const handleOptionChange = (optionId) => {
        setPaymentOption(optionId);
        setData('selected_payment_method', optionId === 'new' ? null : optionId);
    };

    const TEST_CARDS = [
        { id: 'tok_visa', brand: 'Visa', last4: '4242', exp_month: 12, exp_year: 2026, isTest: true },
        { id: 'tok_mastercard', brand: 'MasterCard', last4: '4444', exp_month: 12, exp_year: 2026, isTest: true },
        { id: 'tok_amex', brand: 'Amex', last4: '8431', exp_month: 12, exp_year: 2026, isTest: true },
    ];

    const onSubmitClick = (event) => {
        event.preventDefault();
        setIsConfirming(true);
        setCardError(null);
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

    const getBrandIcon = (brand) => {
        const brands = {
            'visa': 'text-blue-600',
            'mastercard': 'text-red-500',
            'amex': 'text-cyan-600',
        };
        return brands[brand.toLowerCase()] || 'text-gray-600';
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

            <p className="text-sm text-gray-500 mb-6 font-medium">
                Selecciona una tarjeta guardada o añade una nueva para finalizar tu pedido.
            </p>

            <div className="space-y-4">
                {/* Saved Cards List */}
                {!isLoadingCards && (savedCards.length > 0 || (isAdmin)) && (
                    <div className="grid gap-3 mb-6">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                            {isAdmin ? 'Tarjetas Guardadas y de Prueba' : 'Tarjetas Guardadas'}
                        </label>
                        
                        {/* Real Saved Cards */}
                        {savedCards.map(card => (
                            <div 
                                key={card.id}
                                onClick={() => handleOptionChange(card.id)}
                                className={`group flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentOption === card.id ? 'border-[#99b849] bg-[#99b849]/5 ring-1 ring-[#99b849]' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                            >
                                <div className={`w-10 h-6 border rounded flex items-center justify-center mr-4 bg-white ${getBrandIcon(card.card.brand)}`}>
                                    <span className="text-[8px] font-black italic uppercase">{card.card.brand}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900 tracking-wider">•••• {card.card.last4}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Expira: {card.card.exp_month}/{card.card.exp_year}</p>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentOption === card.id ? 'border-[#99b849] bg-[#99b849]' : 'border-gray-200'}`}>
                                    {paymentOption === card.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                            </div>
                        ))}

                        {/* Admin Test Cards */}
                        {isAdmin && TEST_CARDS.map(card => (
                            <div 
                                key={card.id}
                                onClick={() => handleOptionChange(card.id)}
                                className={`group flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentOption === card.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-dashed border-gray-200 bg-gray-50/30 hover:border-primary/50'}`}
                            >
                                <div className="w-10 h-6 border rounded flex flex-col items-center justify-center mr-4 bg-white text-primary">
                                    <span className="text-[8px] font-black italic uppercase leading-none">{card.brand}</span>
                                    <span className="text-[6px] font-black uppercase bg-primary text-white px-1 rounded-sm mt-0.5">TEST</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900 tracking-wider">•••• {card.last4}</p>
                                    <p className="text-[10px] text-primary/60 font-black uppercase">Token: {card.id}</p>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentOption === card.id ? 'border-primary bg-primary' : 'border-gray-200'}`}>
                                    {paymentOption === card.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Use New Card Item */}
                <div 
                    onClick={() => handleOptionChange('new')}
                    className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentOption === 'new' ? 'border-[#99b849] bg-[#99b849]/5 ring-1 ring-[#99b849]' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                >
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mr-4">
                        <span className="material-symbols-outlined text-gray-400">add_card</span>
                    </div>
                    <span className="flex-1 text-sm font-bold text-gray-900 uppercase tracking-tight">Usar otra tarjeta</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentOption === 'new' ? 'border-[#99b849] bg-[#99b849]' : 'border-gray-200'}`}>
                        {paymentOption === 'new' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                </div>

                {/* Card Elements Container (Shown when 'new' selected) */}
                {paymentOption === 'new' && (
                    <div className="animate-in slide-in-from-top-4 duration-300">
                        <div className="relative border-2 border-primary/20 p-6 rounded-2xl bg-white shadow-sm">
                            <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${cardError ? 'border-red-200 bg-red-50/30' : 'border-gray-100 bg-gray-50/50 focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/5'}`}>
                                <div className="flex justify-between items-center mb-3">
                                    <InputLabel value="Detalles de la Tarjeta" className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400" />
                                    <div className="group relative">
                                        <span className="material-symbols-outlined text-gray-400 text-sm cursor-help">info</span>
                                        <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl leading-relaxed">
                                            <p className="font-bold border-b border-white/10 pb-1 mb-1 italic">¿Pago Seguro?</p>
                                            Todas las transacciones pasan por Stripe, un procesador de pagos certificado PCI Nivel 1.
                                        </div>
                                    </div>
                                </div>
                                <div className="px-1 py-1">
                                    <CardElement options={cardElementOptions} onChange={(e) => setCardError(e.error ? e.error.message : null)} />
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {cardError && paymentOption === 'new' && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 animate-in slide-in-from-left-2 duration-300">
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-bold">{cardError}</span>
                    </div>
                )}

                {/* Coming Soon Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-gray-100 p-4 rounded-xl flex items-center bg-gray-50/50 opacity-60 grayscale cursor-not-allowed">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 mr-3" />
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    onClick={onSubmitClick}
                    disabled={processing || isConfirming || !stripe}
                    className="relative px-12 py-5 bg-[#99b849] text-white font-black rounded-2xl hover:bg-[#8da843] shadow-2xl shadow-[#99b849]/20 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 text-xl w-full md:w-auto order-1 md:order-2 overflow-hidden flex items-center justify-center min-w-[280px]"
                >
                    <div className="relative z-10 flex items-center">
                        {processing || isConfirming ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3"></div>
                                <span className="uppercase tracking-[0.2em] text-xs">Procesando...</span>
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined mr-3">verified_user</span>
                                <span className="uppercase tracking-[0.2em] text-xs">Pagar Pedido</span>
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
            </div>
        </div>
    );
}
