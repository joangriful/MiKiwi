import React, { useState } from 'react';

export default function CardsTab() {
    // Mock Data and State
    const [cards, setCards] = useState([
        { id: 1, brand: 'Visa', last4: '4242', expiry: '12/28', holder: 'Juan Pérez', isDefault: true },
        { id: 2, brand: 'Mastercard', last4: '8899', expiry: '05/26', holder: 'Juan Pérez', isDefault: false }
    ]);
    const [isAdding, setIsAdding] = useState(false);
    const [newCard, setNewCard] = useState({ number: '', expiry: '', cvc: '', holder: '' });

    const handleSetDefault = (id) => {
        setCards(cards.map(card => ({
            ...card,
            isDefault: card.id === id
        })));
        // In real app, API call here
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta tarjeta?')) {
            setCards(cards.filter(c => c.id !== id));
        }
    };

    const handleAddCard = (e) => {
        e.preventDefault();
        // Validation logic would go here
        const brand = newCard.number.startsWith('4') ? 'Visa' : 'Mastercard';
        const last4 = newCard.number.slice(-4) || '0000';

        const cardToAdd = {
            id: Date.now(),
            brand,
            last4,
            expiry: newCard.expiry,
            holder: newCard.holder,
            isDefault: cards.length === 0 // If it's first card, make default
        };

        setCards([...cards, cardToAdd]);
        setIsAdding(false);
        setNewCard({ number: '', expiry: '', cvc: '', holder: '' });
    };

    const getBrandIcon = (brand) => {
        // Simple text fallback or path to svg
        // In a real app we'd have SVGs for Visa/Mastercard/Amex
        return brand === 'Visa' ? 'text-blue-600' : 'text-red-500';
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Mis Tarjetas</h2>
                    <p className="text-gray-600 mt-1">Gestiona tus tarjetas de crédito o débito para compras futuras.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#99b849] hover:bg-[#8da843] text-white rounded-lg transition-colors text-sm font-medium"
                >
                    <span className="material-symbols-outlined text-lg">add_card</span>
                    Añadir Nueva
                </button>
            </div>

            {/* List Cards */}
            <div className="grid gap-4">
                {cards.map(card => (
                    <div
                        key={card.id}
                        className={`relative flex items-center p-4 border rounded-xl transition-all ${card.isDefault ? 'border-[#99b849] bg-[#99b849]/5 ring-1 ring-[#99b849]' : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        {/* Start: Icon */}
                        <div className="h-12 w-16 bg-gray-100 rounded flex items-center justify-center mr-4">
                            <span className={`font-bold text-xs ${getBrandIcon(card.brand)}`}>{card.brand}</span>
                        </div>

                        {/* Middle: Details */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h4 className="font-mono text-gray-800 font-medium">•••• •••• •••• {card.last4}</h4>
                                {card.isDefault && (
                                    <span className="text-[10px] bg-[#99b849] text-white px-2 py-0.5 rounded-full uppercase font-bold tracking-wide">
                                        Predeterminada
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Caduca: {card.expiry} • {card.holder}</p>
                        </div>

                        {/* End: Actions */}
                        <div className="flex items-center gap-2">
                            {!card.isDefault && (
                                <button
                                    onClick={() => handleSetDefault(card.id)}
                                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline px-2 py-1"
                                >
                                    Marcar como principal
                                </button>
                            )}
                            <button
                                onClick={() => handleDelete(card.id)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                                title="Eliminar tarjeta"
                            >
                                <span className="material-symbols-outlined text-xl">delete</span>
                            </button>
                        </div>
                    </div>
                ))}

                {cards.length === 0 && !isAdding && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">credit_card_off</span>
                        <p className="text-gray-500">No tienes tarjetas guardadas.</p>
                    </div>
                )}
            </div>

            {/* Add Card Modal / Inline Form */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <h3 className="text-xl font-bold text-gray-900 mb-6">Añadir nueva tarjeta</h3>

                        <form onSubmit={handleAddCard} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Nombre del Titular</label>
                                <input
                                    type="text"
                                    required
                                    value={newCard.holder}
                                    onChange={e => setNewCard({ ...newCard, holder: e.target.value })}
                                    placeholder="Como aparece en la tarjeta"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#99b849] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Número de Tarjeta</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        maxLength={16}
                                        value={newCard.number}
                                        onChange={e => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            setNewCard({ ...newCard, number: val });
                                        }}
                                        placeholder="0000 0000 0000 0000"
                                        className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#99b849] focus:outline-none font-mono"
                                    />
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">credit_card</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Caducidad</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={5}
                                        value={newCard.expiry}
                                        onChange={e => setNewCard({ ...newCard, expiry: e.target.value })}
                                        placeholder="MM/AA"
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#99b849] focus:outline-none text-center"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">CVC</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            required
                                            maxLength={3}
                                            value={newCard.cvc}
                                            onChange={e => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                setNewCard({ ...newCard, cvc: val });
                                            }}
                                            placeholder="123"
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#99b849] focus:outline-none text-center"
                                        />
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm cursor-help" title="Código de 3 dígitos en el reverso">help</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-4 py-3 bg-[#99b849] hover:bg-[#8da843] text-white font-bold rounded-xl transition-all transform active:scale-95"
                            >
                                Añadir Tarjeta
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
