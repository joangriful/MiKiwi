import React, { useEffect } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import es from 'react-phone-input-2/lang/es.json';

export default function InfoStep({ data, setData, onNext, onBack, user, errors }) {
    const spanishPostalcodes = {
        '28': 'Madrid',
        '08': 'Barcelona',
        '41': 'Sevilla',
        '46': 'Valencia',
        '29': 'Málaga',
        '30': 'Murcia',
        '07': 'Palma de Mallorca',
        '50': 'Zaragoza',
        '35': 'Las Palmas de Gran Canaria',
        '38': 'Santa Cruz de Tenerife'
    };

    // Auto-fill form if user data exists and fields are empty
    useEffect(() => {
        if (user) {
            if (!data.first_name) setData('first_name', user.name || '');
            if (!data.email) setData('email', user.email || '');
            if (!data.dni) setData('dni', user.dni || '');
        }
    }, [user]);

    const handlePostalCodeChange = (e) => {
        const value = e.target.value;
        setData('postal_code', value);

        if (value.length >= 2) {
            const prefix = value.substring(0, 2);
            if (spanishPostalcodes[prefix]) {
                setData('city', spanishPostalcodes[prefix]);
            }
        }
    };

    const [dniError, setDniError] = React.useState('');

    const validateDNI = (value) => {
        const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
        const trimmed = value.toUpperCase().replace(/\s/g, '');

        // Regex for DNI and NIE
        if (!/^[XYZ0-9][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/.test(trimmed)) {
            return false;
        }

        let number = trimmed.substring(0, 8);
        const letter = trimmed.charAt(8);

        // NIE handling
        number = number.replace('X', '0').replace('Y', '1').replace('Z', '2');

        const expectedLetter = letters.charAt(parseInt(number, 10) % 23);
        return letter === expectedLetter;
    };

    const autoFill = () => {
        const testData = {
            first_name: 'Juan',
            last_name: 'Pérez',
            email: 'juan.perez@example.com',
            dni: '12345678Z',
            phone: '34622222222',
            address: 'Calle Mayor 1',
            city: 'Madrid',
            postal_code: '28001',
            country: 'España'
        };
        Object.entries(testData).forEach(([key, value]) => {
            setData(key, value);
        });
        setDniError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);

        if (name === 'dni') {
            if (value && !validateDNI(value)) {
                setDniError('DNI/NIE no válido');
            } else {
                setDniError('');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.dni && !validateDNI(data.dni)) {
            setDniError('Por favor, introduce un DNI/NIE válido antes de continuar.');
            return;
        }

        onNext();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">2. Información de Contacto</h2>
                <button
                    type="button"
                    onClick={autoFill}
                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-dark bg-primary/5 px-3 py-1.5 rounded-full border border-primary/20 transition-all hover:bg-primary/10"
                >
                    ⚡ Auto-completar
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <InputLabel htmlFor="first_name" value="Nombre" />
                    <TextInput
                        id="first_name"
                        name="first_name"
                        value={data.first_name}
                        onChange={handleChange}
                        className="mt-1 block w-full"
                        required
                    />
                </div>
                <div>
                    <InputLabel htmlFor="last_name" value="Apellidos" />
                    <TextInput
                        id="last_name"
                        name="last_name"
                        value={data.last_name}
                        onChange={handleChange}
                        className="mt-1 block w-full"
                        required
                    />
                </div>
            </div>

            <div>
                <InputLabel htmlFor="email" value="Correo Electrónico" />
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                    required
                />
                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <InputLabel htmlFor="dni" value="DNI / NIE" />
                    <TextInput
                        id="dni"
                        name="dni"
                        value={data.dni}
                        onChange={handleChange}
                        className={`mt-1 block w-full ${dniError ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="12345678X"
                        required
                    />
                    {dniError && <div className="text-red-500 text-xs mt-1">{dniError}</div>}
                    {errors.dni && <div className="text-red-500 text-xs mt-1">{errors.dni}</div>}
                </div>
                <div>
                    <InputLabel htmlFor="phone" value="Teléfono" />
                    <div className="mt-1 group">
                        <PhoneInput
                            country={'es'}
                            value={data.phone || ''}
                            onChange={(phone) => setData('phone', phone)}
                            localization={es}
                            enableSearch={true}
                            containerClass="phone-input-container !w-full"
                            inputProps={{
                                required: true,
                                name: 'phone'
                            }}
                        />
                        <style>{`
                            .phone-input-container .form-control:focus {
                                border-color: #99b849 !important;
                                ring: 2px solid #99b849 !important;
                            }
                            .react-tel-input .country-list::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                    </div>
                    {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
                    <p className="text-[10px] text-gray-400 mt-1 italic">Detectamos automáticamente el país por el prefijo.</p>
                </div>
            </div>

            <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-3">Dirección de Envío</h3>
                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="address" value="Dirección" />
                        <TextInput
                            id="address"
                            name="address"
                            value={data.address}
                            onChange={handleChange}
                            className="mt-1 block w-full"
                            placeholder="Calle, número, piso..."
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="city" value="Ciudad" />
                            <TextInput
                                id="city"
                                name="city"
                                value={data.city}
                                onChange={handleChange}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="postal_code" value="Código Postal" />
                            <TextInput
                                id="postal_code"
                                name="postal_code"
                                value={data.postal_code}
                                onChange={handlePostalCodeChange}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <InputLabel htmlFor="country" value="País" />
                        <TextInput
                            id="country"
                            name="country"
                            value={data.country}
                            onChange={handleChange}
                            className="mt-1 block w-full"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-gray-100 mt-10">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center px-6 py-3 rounded-xl border-2 border-gray-100 text-gray-400 hover:text-primary hover:border-primary/20 transition-all duration-300 font-bold text-xs uppercase tracking-widest order-2 md:order-1"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver al Carrito
                </button>
                <button
                    type="submit"
                    className="px-12 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark shadow-2xl shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 text-lg w-full md:w-auto order-1 md:order-2 flex items-center justify-center min-w-[280px]"
                >
                    CONTINUAR A ENVÍO
                    <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </form>
    );
}
