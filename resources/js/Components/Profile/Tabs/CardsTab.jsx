import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';

function CardForm({ onCancel, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [holder, setHolder] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        setError(null);

        try {
            // 1. Get SetupIntent client secret
            const { data } = await axios.post(route('payment-methods.setup-intent'));
            const clientSecret = data.clientSecret;

            // 2. Confirm card setup
            const result = await stripe.confirmCardSetup(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: { name: holder },
                },
            });

            if (result.error) {
                setError(result.error.message);
                setIsProcessing(false);
            } else {
                onSuccess();
            }
        } catch (err) {
            setError('Error al iniciar el proceso de registro.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onCancel}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                <h3 className="text-2xl font-black text-gray-900 mb-2">Nueva Tarjeta</h3>
                <p className="text-sm text-gray-500 mb-8">Tus datos se guardarán de forma segura en Stripe.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Nombre del Titular</label>
                        <input
                            type="text"
                            required
                            value={holder}
                            onChange={e => setHolder(e.target.value)}
                            placeholder="Como aparece en la tarjeta"
                            className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#99b849] focus:bg-white transition-all outline-none text-sm font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Datos de la Tarjeta</label>
                        <div className="p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus-within:border-[#99b849] focus-within:bg-white transition-all">
                            <CardElement options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#1f2937',
                                        fontFamily: 'Inter, sans-serif',
                                        '::placeholder': { color: '#9ca3af' },
                                    },
                                }
                            }} />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-in slide-in-from-top-2">
                            <span className="material-symbols-outlined text-xl">error</span>
                            <p className="text-xs font-bold">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!stripe || isProcessing}
                        className="w-full py-4 bg-[#99b849] hover:bg-[#8da843] disabled:bg-gray-200 text-white font-black rounded-xl transition-all shadow-lg shadow-[#99b849]/20 flex items-center justify-center gap-3 active:scale-95"
                    >
                        {isProcessing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span className="uppercase tracking-widest text-xs">Guardando...</span>
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">verified_user</span>
                                <span className="uppercase tracking-widest text-xs">Vincular Tarjeta</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function CardsTab() {
    const { stripeKey } = usePage().props;
    const [stripePromise] = useState(() => loadStripe(stripeKey));
    const [cards, setCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    const fetchCards = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(route('payment-methods.index'));
            setCards(data);
        } catch (err) {
            console.error('Error fetching cards:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta tarjeta?')) return;
        
        try {
            await axios.delete(route('payment-methods.destroy', id));
            setCards(cards.filter(c => c.id !== id));
        } catch (err) {
            alert('Error al eliminar la tarjeta.');
        }
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
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 min-h-[500px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Mis Tarjetas</h2>
                    <p className="text-gray-500 mt-2 font-medium">Bóveda segura de métodos de pago activos.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-3 px-6 py-3 bg-[#99b849] hover:bg-[#8da843] text-white rounded-2xl transition-all shadow-xl shadow-[#99b849]/10 font-black text-[10px] uppercase tracking-widest active:scale-95"
                >
                    <span className="material-symbols-outlined text-lg">add_card</span>
                    Añadir Nuevo Método
                </button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 grayscale opacity-20">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-400 rounded-full animate-spin mb-4"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Sincronizando con Stripe...</span>
                </div>
            ) : cards.length > 0 ? (
                <div className="grid gap-6">
                    {cards.map(card => (
                        <div
                            key={card.id}
                            className="group relative flex items-center p-6 border-2 border-gray-50 bg-gray-50/30 rounded-3xl transition-all hover:border-[#99b849]/30 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50"
                        >
                            <div className="h-14 w-20 bg-white border border-gray-100 rounded-xl flex flex-col items-center justify-center mr-6 shadow-sm overflow-hidden">
                                <span className={`font-black text-[10px] uppercase tracking-tighter ${getBrandIcon(card.card.brand)}`}>{card.card.brand}</span>
                                <div className="w-full h-[2px] bg-gray-50 my-1"></div>
                                <span className="text-[8px] font-bold text-gray-400 uppercase">Credit</span>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-4">
                                    <h4 className="font-mono text-xl text-gray-900 font-bold tracking-widest">•••• •••• •••• {card.card.last4}</h4>
                                </div>
                                <div className="flex items-center gap-4 mt-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                                        <span className="material-symbols-outlined text-sm mr-1 opacity-60">calendar_month</span>
                                        Expira: {card.card.exp_month}/{card.card.exp_year}
                                    </p>
                                    <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                                        <span className="material-symbols-outlined text-sm mr-1 opacity-60">person</span>
                                        {card.billing_details.name || 'Titular'}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDelete(card.id)}
                                className="p-3 text-gray-300 hover:text-red-500 transition-all rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100"
                                title="Eliminar tarjeta"
                            >
                                <span className="material-symbols-outlined text-2xl">delete</span>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 border-2 border-dashed border-gray-100 rounded-[40px] bg-gray-50/50 flex flex-col items-center">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-gray-50">
                        <span className="material-symbols-outlined text-4xl text-gray-200">credit_card_off</span>
                    </div>
                    <p className="text-gray-900 font-black text-xs uppercase tracking-widest">Sin métodos de pago</p>
                    <p className="text-gray-400 text-sm mt-2 max-w-[200px]">Añade una tarjeta para acelerar tus futuras compras en MiKiwi.</p>
                </div>
            )}

            {isAdding && (
                <Elements stripe={stripePromise}>
                    <CardForm 
                        onCancel={() => setIsAdding(false)} 
                        onSuccess={() => {
                            setIsAdding(false);
                            fetchCards();
                        }} 
                    />
                </Elements>
            )}
        </div>
    );
}
