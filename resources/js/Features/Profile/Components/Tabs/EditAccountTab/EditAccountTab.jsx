import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import es from 'react-phone-input-2/lang/es.json';
import './EditAccountTab.css';

export default function EditAccountTab() {
    const { auth } = usePage().props;
    const user = auth?.user || {
        name: 'Usuario MiKiwi',
        email: 'usuario@mikiwi.com',
        phone: '', // Placeholder
        username: 'usuario_mikiwi', // Placeholder
        default_payment_method: 'paypal' // Placeholder
    };

    const [formData, setFormData] = useState({
        name: user.name,
        username: user.username || '',
        email: user.email,
        phone: user.phone || '34', // Default to Spain prefix if empty
        default_payment_method: user.default_payment_method || 'paypal'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Here you would typically make an Inertia put/patch request
        console.log('Saving account details:', formData);
        // router.put(route('profile.update'), formData);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Detalles de la cuenta</h2>
            <p className="text-gray-600 mb-8">Modifica tu información personal y preferencias de cuenta.</p>

            <div className="space-y-6 max-w-2xl">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#99b849] focus:border-[#99b849]"
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de Usuario</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#99b849] focus:border-[#99b849]"
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#99b849] focus:border-[#99b849]"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono Móvil</label>
                    <div className="relative">
                        <PhoneInput
                            country={'es'}
                            value={formData.phone}
                            onChange={(phone, data) => {
                                // Smart Delete Logic (reused from AddressCard)
                                if (data && data.dialCode) {
                                    if (!phone || phone === data.dialCode) {
                                        setFormData(prev => ({ ...prev, phone: data.dialCode }));
                                        return;
                                    }
                                    if (!phone.startsWith(data.dialCode)) {
                                        setFormData(prev => ({ ...prev, phone: data.dialCode }));
                                        return;
                                    }
                                }
                                setFormData(prev => ({ ...prev, phone }));
                            }}
                            localization={es}
                            enableSearch={true}
                            disableSearchIcon={true}
                            searchStyle={{
                                width: '0px',
                                height: '0px',
                                padding: '0px',
                                border: 'none',
                                margin: '0px',
                                opacity: 0,
                                position: 'absolute',
                                left: '-9999px'
                            }}
                            inputStyle={{
                                width: '100%',
                                height: '46px', // Slightly taller to match other inputs
                                fontSize: '16px',
                                paddingLeft: '48px',
                                borderRadius: '0.5rem',
                                borderColor: '#d1d5db'
                            }}
                            buttonStyle={{
                                borderRadius: '0.5rem 0 0 0.5rem',
                                borderColor: '#d1d5db'
                            }}
                            dropdownStyle={{
                                textAlign: 'left',
                                zIndex: 1000,
                                borderRadius: '12px',
                                marginTop: '4px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                            }}
                            separateDialCode={true}
                            enableLongNumbers={false}
                        />
                        <style>{`
                            /* Shared Styles for Phone Input (Reused) */
                            .react-tel-input .country-list::-webkit-scrollbar { display: none; }
                            .react-tel-input .country-list { -ms-overflow-style: none; scrollbar-width: none; }
                            .react-tel-input .country-list .country { display: flex; align-items: center; padding: 12px 15px !important; }
                            .react-tel-input .country-list .country:hover { background-color: #f9fafb !important; }
                            .react-tel-input .country-list .country .flag { order: 1; margin-right: 12px !important; transform: scale(1.2); }
                            .react-tel-input .country-list .country .dial-code { order: 2; font-weight: 600; color: #374151; margin-right: 8px; }
                            .react-tel-input .country-list .country .country-name { order: 3; color: #6b7280; }
                            .react-tel-input .country-list .country.highlight { background-color: #f3f4f6 !important; }
                            .react-tel-input .selected-flag { border-radius: 0.5rem 0 0 0.5rem !important; }
                            .react-tel-input .selected-flag:hover, .react-tel-input .selected-flag:focus { background-color: #f3f4f6 !important; border-radius: 0.5rem 0 0 0.5rem !important; }
                        `}</style>
                    </div>
                </div>

                {/* Default Payment Method */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago Predeterminado</label>
                    <select
                        name="default_payment_method"
                        value={formData.default_payment_method}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#99b849] focus:border-[#99b849] bg-white"
                    >
                        <option value="paypal">PayPal</option>
                        <option value="card_default">Tarjeta predeterminada</option>
                        <option value="apple_pay">Apple Pay</option>
                        <option value="google_pay">Google Pay</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                        Si seleccionas "Tarjeta predeterminada", se usará la tarjeta que hayas marcado como favorita en la sección de Tarjetas.
                    </p>
                </div>

                <div className="pt-6">
                    <button
                        onClick={handleSave}
                        className="px-8 py-3 bg-[#99b849] hover:bg-[#8da843] text-white font-semibold rounded-xl shadow-sm transition-all transform hover:scale-[1.02]"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
}
