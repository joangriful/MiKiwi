import React, { useState } from 'react';
import AddressCard from '../../AddressCard/AddressCard';
import './AddressesTab.css';

export default function AddressesTab() {
    // Mock initial data
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            name: 'Casa',
            street: 'Calle Falsa 123, 2º B',
            city: 'Madrid',
            state: 'Madrid',
            zip: '28001',
            phone: '+34 600 000 000',
            isDefault: true
        }
    ]);

    const handleSaveAddress = (updatedAddress) => {
        setAddresses(prev => {
            if (updatedAddress.isNew) {
                // Remove the 'isNew' flag and add to list properly if not already there (though it is there, just editing)
                // Actually, if it's new, it is already in the list but with isNew=true.
                // We just update it and remove isNew.
                return prev.map(addr =>
                    addr.id === updatedAddress.id
                        ? { ...updatedAddress, isNew: false }
                        : addr
                );
            } else {
                return prev.map(addr => addr.id === updatedAddress.id ? updatedAddress : addr);
            }
        });
    };

    const handleDeleteAddress = (id) => {
        setAddresses(prev => prev.filter(addr => addr.id !== id));
    };

    const handleSetDefault = (id) => {
        setAddresses(prev => prev.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        })));
    };

    const handleAddAddress = () => {
        const newId = Math.max(...addresses.map(a => a.id), 0) + 1;
        const newAddress = {
            id: newId,
            name: '',
            street: '',
            city: '',
            state: '',
            zip: '',
            phone: '',
            isDefault: addresses.length === 0, // Default if it's the first one
            isNew: true
        };
        setAddresses(prev => [...prev, newAddress]);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Direcciones</h2>
                <button
                    onClick={handleAddAddress}
                    className="flex items-center gap-2 px-4 py-2 bg-[#99b849] hover:bg-[#8da843] text-white rounded-lg shadow-sm transition-all"
                >
                    <span className="text-xl leading-none">+</span>
                    Añadir dirección
                </button>
            </div>

            <p className="text-gray-600 mb-6">Administra las direcciones de envío para tus pedidos.</p>

            <div className="space-y-4">
                {addresses.length === 0 && (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">No tienes direcciones guardadas.</p>
                    </div>
                )}

                {addresses.map(address => (
                    <AddressCard
                        key={address.id}
                        address={address}
                        isDefault={address.isDefault}
                        onSave={handleSaveAddress}
                        onDelete={handleDeleteAddress}
                        onSetDefault={handleSetDefault}
                    />
                ))}
            </div>
        </div>
    );
}
