import React, { useState } from 'react';

const TEST_CARDS = [
    { brand: 'Visa', number: '4242 4242 4242 4242', exp: '12/26', cvc: '123', type: 'Success', icon: 'payments' },
    { brand: 'MasterCard', number: '5555 5555 5555 4444', exp: '12/26', cvc: '123', type: 'Success', icon: 'credit_card' },
    { brand: 'Amex', number: '3782 8224 6310 005', exp: '12/26', cvc: '123', type: 'Success', icon: 'account_balance_wallet' },
    { brand: 'Discover', number: '6011 1111 1111 1117', exp: '12/26', cvc: '123', type: 'Success', icon: 'card_giftcard' },
    { brand: 'Generic', number: '4000 0000 0000 0002', exp: '12/26', cvc: '123', type: 'Declined', icon: 'error' },
    { brand: 'Generic', number: '4000 0000 0000 0069', exp: '01/20', cvc: '123', type: 'Expired', icon: 'event_busy' },
];

export default function StripeTestCards() {
    const [copied, setCopied] = useState(null);

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="p-8 bg-gray-50 min-h-full">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Pasarela de Pagos (Stripe)</h2>
                    <p className="text-gray-500 mt-2">Tarjetas de prueba para validación de flujos de pago en entorno de desarrollo.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {TEST_CARDS.map((card, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${card.type === 'Success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        <span className="material-symbols-outlined">{card.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{card.brand}</h3>
                                        <span className={`text-[10px] uppercase font-bold tracking-widest ${card.type === 'Success' ? 'text-green-500' : 'text-red-500'}`}>
                                            {card.type}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleCopy(card.number.replace(/\s/g, ''), `num-${idx}`)}
                                    className="text-gray-400 hover:text-gray-900 transition-colors"
                                    title="Copiar número"
                                >
                                    <span className="material-symbols-outlined text-xl">
                                        {copied === `num-${idx}` ? 'check' : 'content_copy'}
                                    </span>
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div 
                                    className="bg-gray-50 p-3 rounded-xl flex justify-between items-center cursor-pointer group"
                                    onClick={() => handleCopy(card.number.replace(/\s/g, ''), `num-${idx}`)}
                                >
                                    <span className="text-lg font-mono tracking-wider text-gray-700">{card.number}</span>
                                    <span className="text-[10px] font-bold text-gray-300 group-hover:text-gray-900 uppercase">Copiar</span>
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-1 bg-gray-50 p-3 rounded-xl flex justify-between items-center">
                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-tight">Exp</span>
                                        <span className="font-mono text-gray-700">{card.exp}</span>
                                    </div>
                                    <div className="flex-1 bg-gray-50 p-3 rounded-xl flex justify-between items-center">
                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-tight">CVC</span>
                                        <span className="font-mono text-gray-700">{card.cvc}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-indigo-900 text-white p-8 rounded-3xl shadow-xl overflow-hidden relative">
                    <div className="relative z-10">
                        <h4 className="text-xl font-bold mb-2">Recordatorio de Desarrollo</h4>
                        <p className="text-indigo-100 text-sm leading-relaxed max-w-2xl">
                            Estas tarjetas solo funcionan cuando la API de Stripe está en modo <strong>test</strong>. 
                            Cualquier intento de uso en producción resultará en error. 
                            El C.P. recomendado para España es <strong>28001</strong>.
                        </p>
                    </div>
                    <span className="material-symbols-outlined absolute -right-8 -bottom-8 text-[160px] text-white/5 rotate-12">
                        security
                    </span>
                </div>
            </div>
        </div>
    );
}
