import React, { useState } from 'react';
import AddressCard from '@/Components/Profile/AddressCard/AddressCard';
import styles from './AddressesTab.module.css';

export default function AddressesTab() {
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            name: 'Casa',
            street: 'Calle Falsa 123, 2º B',
            city: 'Madrid',
            state: 'Madrid',
            zip: '28001',
            phone: '+34 600 000 000',
            isDefault: true,
        },
    ]);

    const handleSaveAddress = (updatedAddress) => {
        setAddresses((previous) => previous.map((address) => (
            address.id === updatedAddress.id
                ? { ...updatedAddress, isNew: false }
                : address
        )));
    };

    const handleDeleteAddress = (id) => {
        setAddresses((previous) => previous.filter((address) => address.id !== id));
    };

    const handleSetDefault = (id) => {
        setAddresses((previous) => previous.map((address) => ({
            ...address,
            isDefault: address.id === id,
        })));
    };

    const handleAddAddress = () => {
        const newId = Math.max(...addresses.map((address) => address.id), 0) + 1;

        setAddresses((previous) => [
            ...previous,
            {
                id: newId,
                name: '',
                street: '',
                city: '',
                state: '',
                zip: '',
                phone: '',
                isDefault: addresses.length === 0,
                isNew: true,
            },
        ]);
    };

    return (
        <div className={`${styles.root} ${styles.panel}`}>
            <div className={styles.header}>
                <h2 className={styles.title}>Direcciones</h2>
                <button onClick={handleAddAddress} className={styles.addButton}>
                    <span className={styles.addIcon}>+</span>
                    Añadir dirección
                </button>
            </div>

            <p className={styles.description}>
                Administra las direcciones de envío para tus pedidos.
            </p>

            <div className={styles.list}>
                {addresses.length === 0 && (
                    <div className={styles.emptyState}>
                        <p className={styles.emptyText}>No tienes direcciones guardadas.</p>
                    </div>
                )}

                {addresses.map((address) => (
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
