import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import InputLabel from '@/Components/InputLabel/InputLabel';
import styles from './PaymentStep.module.css';

export default function PaymentStep({ data, setData, auth, onSubmit, onBack, processing }) {
    const isAdmin = auth?.user?.role === 'admin';
    const stripe = useStripe();
    const elements = useElements();
    const [cardError, setCardError] = useState(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [savedCards, setSavedCards] = useState([]);
    const [isLoadingCards, setIsLoadingCards] = useState(false);
    const [paymentOption, setPaymentOption] = useState('new'); // 'new' or card ID
    const [showAdminTestCards, setShowAdminTestCards] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [isCardComplete, setIsCardComplete] = useState(false);

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
            } else {
                // If no cards, ensure 'new' is selected
                setPaymentOption('new');
                setData('selected_payment_method', null);
            }
        } catch (err) {
            console.error('Error fetching saved cards:', err);
        } finally {
            setIsLoadingCards(false);
        }
    };

    const handleOptionChange = (optionId) => {
        console.log('Changing payment option to:', optionId);
        setPaymentOption(optionId);
        setData('selected_payment_method', optionId === 'new' ? null : optionId);
    };

    const toggleAdminTestCards = () => setShowAdminTestCards(!showAdminTestCards);

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const TEST_CARDS = [
        { brand: 'Visa', number: '4242424242424242', display: '4242 4242 4242 4242', exp: '12/26', cvc: '123', id: 'tok_visa' },
        { brand: 'MasterCard', number: '5555555555554444', display: '5555 5555 5555 4444', exp: '12/26', cvc: '123', id: 'tok_mastercard' },
        { brand: 'Amex', number: '378282246310005', display: '3782 8224 6310 005', exp: '12/26', cvc: '123', id: 'tok_amex' },
    ];

    const onSubmitClick = (event) => {
        event.preventDefault();

        if (paymentOption === 'new' && !isCardComplete) {
            setCardError('Por favor, completa los datos de tu tarjeta.');
            return;
        }

        setIsConfirming(true);
        setCardError(null);
        onSubmit();
    };

    const handleCardChange = (event) => {
        setIsCardComplete(event.complete);
        setCardError(event.error ? event.error.message : null);
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
        <div className={`${styles.root} space-y-10 animate-in slide-in-from-right duration-700`}>
            <div className="flex justify-between items-end mb-10 pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">Casi listo...</h2>
                    <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mt-2">Paso 4 de 4 — Pago Seguro</p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-2xl border border-green-100">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Encriptado SSL</span>
                </div>
            </div>

            <div className="flex items-center space-x-4 bg-gray-50/50 p-6 rounded-3xl border border-gray-100 mb-10">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                    <span className="material-symbols-outlined text-2xl">shield_moon</span>
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed flex-1">
                    Selecciona un método de pago. Tus datos están protegidos por encriptación de grado bancario.
                </p>
            </div>

            <div className="space-y-4">
                {/* Saved Cards List */}
                {!isLoadingCards && (savedCards.length > 0 || isAdmin) && (
                    <div className="grid gap-4 mb-6">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 mb-2 flex items-center gap-2">
                            <span className="w-4 h-px bg-gray-100"></span>
                            {isAdmin ? 'Tarjetas Guardadas y Modo Prueba' : 'Tus Tarjetas Guardadas'}
                        </label>

                        {savedCards.map(card => (
                            <div
                                key={card.id}
                                onClick={() => handleOptionChange(card.id)}
                                className={`group flex items-center p-6 border-2 rounded-3xl cursor-pointer transition-all duration-500 transform ${paymentOption === card.id ? 'border-primary bg-primary/5 ring-8 ring-primary/5 -translate-y-1 font-bold' : 'border-gray-50 bg-white hover:border-gray-100 shadow-sm'}`}
                            >
                                <div className={`w-14 h-9 rounded-xl flex items-center justify-center mr-6 bg-white border border-gray-100 shadow-sm overflow-hidden p-1 transition-all ${paymentOption === card.id ? 'bg-primary/10 border-primary/20' : ''}`}>
                                    <span className={`text-[10px] font-black italic uppercase italic tracking-tighter ${getBrandIcon(card.card.brand)}`}>{card.card.brand}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black text-gray-900 tracking-[0.2em]">•••• {card.card.last4}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Vence: {card.card.exp_month}/{card.card.exp_year}</p>
                                </div>
                                <div className={`w-6 h-6 rounded-xl border-4 flex items-center justify-center transition-all duration-500 ${paymentOption === card.id ? 'border-primary bg-primary shadow-lg shadow-primary/20' : 'border-gray-100 bg-gray-50'}`}>
                                    {paymentOption === card.id && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                            </div>
                        ))}

                        {isAdmin && TEST_CARDS.map(card => {
                            const tokenOptionId = card.id;
                            return (
                                <div
                                    key={tokenOptionId}
                                    onClick={() => handleOptionChange(tokenOptionId)}
                                    className={`group flex items-center p-6 border-2 rounded-3xl cursor-pointer transition-all duration-500 transform ${paymentOption === tokenOptionId ? 'border-primary bg-primary/5 ring-8 ring-primary/5' : 'border-dashed border-gray-100 bg-gray-50/50 hover:border-primary/30 shadow-sm'}`}
                                >
                                    <div className="w-14 h-9 rounded-xl bg-white border border-gray-200 flex flex-col items-center justify-center mr-6 shadow-sm">
                                        <span className="text-[8px] font-black italic uppercase leading-none text-primary">{card.brand}</span>
                                        <span className="text-[6px] font-black uppercase bg-primary text-white px-1.5 py-0.5 rounded-full mt-1 tracking-tighter shadow-sm shadow-primary/20">TEST</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-gray-900 tracking-[0.2em]">•••• {card.number.slice(-4)}</p>
                                        <p className="text-[10px] text-primary/60 font-black uppercase tracking-widest mt-1">{tokenOptionId}</p>
                                    </div>
                                    <div className={`w-6 h-6 rounded-xl border-4 flex items-center justify-center transition-all duration-500 ${paymentOption === tokenOptionId ? 'border-primary bg-primary' : 'border-gray-100'}`}>
                                        {paymentOption === tokenOptionId && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Use New Card Item */}
                <div
                    onClick={() => handleOptionChange('new')}
                    className={`flex items-center p-6 border-2 rounded-3xl cursor-pointer transition-all duration-500 transform ${paymentOption === 'new' ? 'border-primary bg-primary/5 ring-8 ring-primary/5 -translate-y-1' : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'}`}
                >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-6 transition-all ${paymentOption === 'new' ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-110' : 'bg-gray-50 text-gray-400 group-hover:bg-primary/10'}`}>
                        <span className="material-symbols-outlined text-2xl">add_card</span>
                    </div>
                    <div className="flex-1">
                        <span className="text-sm font-black text-gray-900 uppercase tracking-widest block">Nueva Tarjeta de Crédito</span>
                        {paymentOption === 'new' && (
                            <span className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">Completa los datos a continuación</span>
                        )}
                    </div>
                    <div className={`w-6 h-6 rounded-xl border-4 flex items-center justify-center transition-all duration-500 ${paymentOption === 'new' ? 'border-primary bg-primary' : 'border-gray-100'}`}>
                        {paymentOption === 'new' && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                </div>

                {/* Card Elements Container (Shown when 'new' selected) */}
                {paymentOption === 'new' && (
                    <div className="animate-in slide-in-from-top-4 duration-500 py-4">
                        <div className="relative border-4 border-primary/10 p-10 rounded-[2.5rem] bg-white shadow-2xl">
                            <div className={`relative p-8 rounded-3xl border-2 transition-all duration-500 shadow-inner ${cardError ? 'border-red-100 bg-red-50/20' : isCardComplete ? 'border-green-100 bg-green-50/20' : 'border-gray-50 bg-gray-50/50 focus-within:border-primary focus-within:bg-white focus-within:ring-8 focus-within:ring-primary/5'}`}>
                                <div className="flex justify-between items-center mb-8">
                                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 flex items-center gap-2">
                                        <span className="w-12 h-[2px] bg-primary/20"></span>
                                        Introduce tus datos
                                    </h4>
                                    <div className="flex gap-2">
                                        <div className="w-8 h-5 bg-white border border-gray-100 rounded-md shadow-sm opacity-50 grayscale scale-90"></div>
                                        <div className="w-8 h-5 bg-white border border-gray-100 rounded-md shadow-sm scale-90"></div>
                                        <div className="w-8 h-5 bg-white border border-gray-100 rounded-md shadow-sm opacity-50 grayscale scale-90"></div>
                                    </div>
                                </div>
                                <div className="px-2 py-4">
                                    <CardElement options={cardElementOptions} onChange={handleCardChange} />
                                </div>

                                {isCardComplete && !cardError && (
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg animate-in zoom-in-50 duration-300">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                )}
                            </div>

                            {isAdmin && (
                                <div className="mt-4 border-t border-gray-100 pt-4">
                                    <button
                                        type="button"
                                        onClick={toggleAdminTestCards}
                                        className="w-full py-2 border-2 border-dashed border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">science</span>
                                        {showAdminTestCards ? 'Ocultar Cuentas de Prueba' : 'Modo Developer: Ver Cuentas de Prueba'}
                                    </button>

                                    {showAdminTestCards && (
                                        <div className="mt-4 grid grid-cols-1 gap-2 animate-in slide-in-from-top-2 duration-200">
                                            {TEST_CARDS.map((card, idx) => (
                                                <div key={idx} className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center justify-between group">
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-black uppercase text-gray-400 tracking-tighter">{card.brand}</span>
                                                        <span className="font-mono text-xs text-gray-600 tracking-wider transition-colors group-hover:text-primary">{card.display}</span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => copyToClipboard(card.number, `num-${idx}`)}
                                                            className={`p-1.5 rounded-lg transition-all ${copiedId === `num-${idx}` ? 'bg-green-100 text-green-600' : 'bg-white text-gray-400 hover:text-gray-900 shadow-sm border border-gray-100'}`}
                                                            title="Copiar Número"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">{copiedId === `num-${idx}` ? 'check' : 'content_copy'}</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => copyToClipboard(`${card.exp} | ${card.cvc}`, `exp-${idx}`)}
                                                            className={`p-1.5 rounded-lg transition-all ${copiedId === `exp-${idx}` ? 'bg-green-100 text-green-600' : 'bg-white text-gray-400 hover:text-gray-900 shadow-sm border border-gray-100'}`}
                                                            title="Copiar Exp/CVC"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">{copiedId === `exp-${idx}` ? 'check' : 'calendar_today'}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <p className="text-[8px] text-center text-gray-400 font-bold uppercase mt-1">C.P. Recomendado: 28001</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {cardError && paymentOption === 'new' && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 animate-in translate-x-1 duration-300">
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-bold">{cardError}</span>
                    </div>
                )}
            </div>

            {/* Billing Address Toggle */}
            <div className={`mt-10 p-2 rounded-[2rem] border-2 transition-all duration-500 ${data.billing_same_as_shipping ? 'border-gray-50 bg-gray-50/30' : 'border-primary/20 bg-primary/5 shadow-inner'}`}>
                <div className="p-8 flex items-start group/billing cursor-pointer" onClick={() => setData('billing_same_as_shipping', !data.billing_same_as_shipping)}>
                    <div className="flex items-center h-8">
                        <div className={`w-8 h-8 rounded-xl border-4 flex items-center justify-center transition-all duration-500 ${data.billing_same_as_shipping ? 'border-primary bg-primary shadow-lg shadow-primary/20 scale-110' : 'border-gray-200 bg-white group-hover/billing:border-primary/30'}`}>
                            {data.billing_same_as_shipping && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                    </div>
                    <div className="ml-6 flex flex-col">
                        <label className="text-sm text-gray-900 font-black uppercase tracking-tight cursor-pointer">
                            Usar misma dirección de facturación
                        </label>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2 opacity-60">
                            Haremos llegar la factura a tus datos de envío habituales.
                        </p>
                    </div>
                </div>

                {!data.billing_same_as_shipping && (
                    <div className="p-10 bg-white rounded-[2rem] border border-gray-100 space-y-10 m-2 animate-in slide-in-from-top-6 duration-700 shadow-xl shadow-primary/5">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Datos Factura</span>
                            <div className="flex-grow h-px bg-gray-50"></div>
                        </div>
                        <div className="space-y-4">
                            <InputLabel htmlFor="billing_address" value="Dirección Completa" className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1" />
                            <input
                                id="billing_address"
                                type="text"
                                value={data.billing_address.address}
                                onChange={(e) => setData('billing_address', { ...data.billing_address, address: e.target.value })}
                                className="w-full !rounded-2xl !border-gray-100 !bg-gray-50/50 focus:!bg-white transition-all !h-14 !px-6 text-sm font-medium"
                                placeholder="Calle, número, portal..."
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <InputLabel htmlFor="billing_city" value="Ciudad" className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1" />
                                <input
                                    id="billing_city"
                                    type="text"
                                    value={data.billing_address.city}
                                    onChange={(e) => setData('billing_address', { ...data.billing_address, city: e.target.value })}
                                    className="w-full !rounded-2xl !border-gray-100 !bg-gray-50/50 focus:!bg-white transition-all !h-14 !px-6 text-sm font-medium"
                                    placeholder="Ej: Madrid"
                                    required
                                />
                            </div>
                            <div className="space-y-4">
                                <InputLabel htmlFor="billing_postal_code" value="Código Postal" className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1" />
                                <input
                                    id="billing_postal_code"
                                    type="text"
                                    value={data.billing_address.postal_code}
                                    onChange={(e) => setData('billing_address', { ...data.billing_address, postal_code: e.target.value })}
                                    className="w-full !rounded-2xl !border-gray-100 !bg-gray-50/50 focus:!bg-white transition-all !h-14 !px-6 text-sm font-medium"
                                    placeholder="28001"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Final Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-gray-100 mt-12">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex justify-center items-center px-8 py-4 bg-gray-50 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary hover:bg-primary/5 transition-all duration-300 group order-2 md:order-1 min-w-[200px]"
                >
                    <span className="mr-2 group-hover:-translate-x-1 transition-transform">
                        &larr;
                    </span>{" "}
                    Volver a Envío
                </button>

                <button
                    onClick={onSubmitClick}
                    disabled={processing || isConfirming || !stripe || (paymentOption === 'new' && !isCardComplete)}
                    className={`relative px-16 py-6 font-black rounded-3xl transition-all duration-500 transform text-xl w-full md:w-auto order-1 md:order-2 overflow-hidden flex items-center justify-center min-w-[350px] group ${(paymentOption === 'new' && !isCardComplete) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark shadow-[0_20px_50px_rgba(153,184,73,0.3)] hover:-translate-y-2 active:scale-95'
                        }`}
                >
                    <div className="relative z-10 flex items-center">
                        {processing || isConfirming ? (
                            <>
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-4"></div>
                                <span className="uppercase tracking-[0.3em] text-xs">Confirmando...</span>
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined mr-4 group-hover:scale-125 transition-transform duration-500">verified_user</span>
                                <span className="uppercase tracking-[0.2em] text-sm">FINALIZAR PEDIDO</span>
                            </>
                        )}
                    </div>
                    {(!paymentOption || (paymentOption === 'new' && isCardComplete) || (paymentOption !== 'new')) && (
                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    )}
                </button>
            </div>
        </div>

    );
}
