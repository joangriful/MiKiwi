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
        <form onSubmit={handleSubmit} className="space-y-10 animate-in slide-in-from-right duration-700">
            <div className="flex justify-between items-end mb-10 pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">Información</h2>
                    <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mt-2">Paso 2 de 4</p>
                </div>
                <button
                    type="button"
                    onClick={autoFill}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white bg-primary/5 px-5 py-2.5 rounded-2xl border border-primary/10 transition-all active:scale-95"
                >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                    Auto-completar
                </button>
            </div>

            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-black text-xs">A</div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Datos Personales</h3>
                    <div className="flex-grow h-px bg-gray-50"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <InputLabel htmlFor="first_name" value="Nombre" className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-400" />
                        <TextInput
                            id="first_name"
                            name="first_name"
                            value={data.first_name}
                            onChange={handleChange}
                            className="w-full !rounded-2xl !border-gray-100 !bg-gray-50/50 focus:!bg-white transition-all !h-14 !px-6"
                            placeholder="Tu nombre"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <InputLabel htmlFor="last_name" value="Apellidos" className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-400" />
                        <TextInput
                            id="last_name"
                            name="last_name"
                            value={data.last_name}
                            onChange={handleChange}
                            className="w-full !rounded-2xl !border-gray-100 !bg-gray-50/50 focus:!bg-white transition-all !h-14 !px-6"
                            placeholder="Tus apellidos"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <InputLabel htmlFor="email" value="Correo Electrónico" className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-400" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        className="w-full !rounded-2xl !border-gray-100 !bg-gray-50/50 focus:!bg-white transition-all !h-14 !px-6"
                        placeholder="tu@email.com"
                        required
                    />
                    {errors.email && <div className="text-red-500 text-[10px] font-bold uppercase mt-2 ml-2">{errors.email}</div>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <InputLabel htmlFor="dni" value="DNI / NIE" className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-400" />
                        <TextInput
                            id="dni"
                            name="dni"
                            value={data.dni}
                            onChange={handleChange}
                            className={`w-full !rounded-2xl !bg-gray-50/50 focus:!bg-white transition-all !h-14 !px-6 ${dniError ? '!border-red-200 !text-red-500' : '!border-gray-100'}`}
                            placeholder="12345678X"
                            required
                        />
                        {dniError && <div className="text-red-400 text-[10px] font-bold uppercase mt-2 ml-2">{dniError}</div>}
                    </div>
                    <div className="space-y-2">
                        <InputLabel htmlFor="phone" value="Teléfono" className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-400" />
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
                                    name: 'phone',
                                    className: 'form-control !w-full !h-14 !rounded-2xl !border-gray-100 !bg-gray-50/50 focus:!bg-white !pl-[60px] !text-sm !font-medium'
                                }}
                                buttonClass="!bg-transparent !border-none !rounded-2xl !ml-2 group-hover:!bg-white"
                            />
                            <style>{`
                                .phone-input-container .form-control:focus {
                                    border-color: #99b849 !important;
                                    box-shadow: 0 0 0 4px rgba(153, 184, 73, 0.05) !important;
                                }
                                .react-tel-input .country-list {
                                    border-radius: 1rem !important;
                                    margin-top: 5px !important;
                                    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1) !important;
                                    border: 1px solid #f3f4f6 !important;
                                }
                                .react-tel-input .country-list::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>
                        </div>
                    </div>
                </div>

                <div className="pt-10 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">B</div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Dirección de Envío</h3>
                    <div className="flex-grow h-px bg-gray-50"></div>
                </div>

                <div className="space-y-8">
                    <div className="space-y-2">
                        <InputLabel htmlFor="address" value="Calle y número" className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-400" />
                        <TextInput
                            id="address"
                            name="address"
                            value={data.address}
                            onChange={handleChange}
                            className="w-full !rounded-2xl !border-gray-100 !bg-gray-50/50 focus:!bg-white transition-all !h-14 !px-6"
                            placeholder="Ej: Calle Gran Vía 12, 4º B"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <InputLabel htmlFor="city" value="Ciudad" className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-400" />
                            <TextInput
                                id="city"
                                name="city"
                                value={data.city}
                                onChange={handleChange}
                                className="w-full !rounded-2xl !border-gray-100 !bg-gray-50/50 focus:!bg-white transition-all !h-14 !px-6"
                                placeholder="Tu ciudad"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <InputLabel htmlFor="postal_code" value="Código Postal" className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-400" />
                            <TextInput
                                id="postal_code"
                                name="postal_code"
                                value={data.postal_code}
                                onChange={handlePostalCodeChange}
                                className="w-full !rounded-2xl !border-gray-100 !bg-gray-50/50 focus:!bg-white transition-all !h-14 !px-6"
                                placeholder="28001"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <InputLabel htmlFor="country" value="País" className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-400" />
                        <TextInput
                            id="country"
                            name="country"
                            value={data.country}
                            onChange={handleChange}
                            className="w-full !rounded-2xl !border-gray-100 !bg-gray-50/50 focus:!bg-white transition-all !h-14 !px-6"
                            placeholder="España"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-gray-100 mt-12">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex justify-center items-center px-8 py-4 bg-gray-50 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary hover:bg-primary/5 transition-all duration-300 group order-2 md:order-1 min-w-[200px]"
                >
                    <span className="mr-2 group-hover:-translate-x-1 transition-transform">
                        &larr;
                    </span>{" "}
                    Volver al Carrito
                </button>
                <button
                    type="submit"
                    className="px-12 py-5 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark shadow-2xl shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 text-xl w-full md:w-auto order-1 md:order-2 flex items-center justify-center min-w-[320px] group"
                >
                    CONTINUAR A ENVÍO
                    <svg className="w-5 h-5 ml-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </form>
    );
}
