import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import es from 'react-phone-input-2/lang/es.json';
import styles from './EditAccountTab.module.css';

export default function EditAccountTab() {
    const { auth } = usePage().props;
    const user = auth?.user || {
        name: 'Usuario MiKiwi',
        email: 'usuario@mikiwi.com',
        phone: '',
        username: 'usuario_mikiwi',
        default_payment_method: 'paypal',
    };

    const [formData, setFormData] = useState({
        name: user.name,
        username: user.username || '',
        email: user.email,
        phone: user.phone || '34',
        default_payment_method: user.default_payment_method || 'paypal',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const handleSave = () => {
        console.log('Saving account details:', formData);
    };

    const handlePhoneChange = (phone, data) => {
        if (data && data.dialCode) {
            if (!phone || phone === data.dialCode) {
                setFormData((previous) => ({ ...previous, phone: data.dialCode }));
                return;
            }

            if (!phone.startsWith(data.dialCode)) {
                setFormData((previous) => ({ ...previous, phone: data.dialCode }));
                return;
            }
        }

        setFormData((previous) => ({ ...previous, phone }));
    };

    return (
        <div className={`${styles.root} ${styles.panel}`}>
            <h2 className={styles.title}>Editar Detalles de la cuenta</h2>
            <p className={styles.description}>
                Modifica tu información personal y preferencias de cuenta.
            </p>

            <div className={styles.form}>
                <div className={styles.grid}>
                    <div>
                        <label className={styles.label}>Nombre Completo</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    <div>
                        <label className={styles.label}>Nombre de Usuario</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                </div>

                <div>
                    <label className={styles.label}>Correo Electrónico</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>

                <div>
                    <label className={styles.label}>Teléfono Móvil</label>
                    <PhoneInput
                        country="es"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        localization={es}
                        enableSearch
                        disableSearchIcon
                        separateDialCode
                        enableLongNumbers={false}
                        containerClass={styles.phoneContainer}
                        inputClass={styles.phoneInput}
                        buttonClass={styles.phoneButton}
                        dropdownClass={styles.phoneDropdown}
                        searchClass={styles.phoneSearch}
                    />
                </div>

                <div>
                    <label className={styles.label}>Método de Pago Predeterminado</label>
                    <select
                        name="default_payment_method"
                        value={formData.default_payment_method}
                        onChange={handleChange}
                        className={styles.select}
                    >
                        <option value="paypal">PayPal</option>
                        <option value="card_default">Tarjeta predeterminada</option>
                        <option value="apple_pay">Apple Pay</option>
                        <option value="google_pay">Google Pay</option>
                    </select>
                    <p className={styles.helpText}>
                        Si seleccionas "Tarjeta predeterminada", se usará la tarjeta que hayas marcado como favorita en la sección de Tarjetas.
                    </p>
                </div>

                <div className={styles.actions}>
                    <button onClick={handleSave} className={styles.saveButton}>
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
}
