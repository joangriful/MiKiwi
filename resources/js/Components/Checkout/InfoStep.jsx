import React, { useEffect } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

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

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation could go here
        onNext();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">2. Información de Contacto</h2>

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
                        className="mt-1 block w-full"
                        placeholder="12345678X"
                        required
                    />
                    {errors.dni && <div className="text-red-500 text-xs mt-1">{errors.dni}</div>}
                </div>
                <div>
                    <InputLabel htmlFor="phone" value="Teléfono" />
                    <div className="flex mt-1">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            {data.phone?.startsWith('+') ? '' : '+34'}
                        </span>
                        <TextInput
                            id="phone"
                            name="phone"
                            value={data.phone}
                            onChange={handleChange}
                            className="block w-full rounded-l-none"
                            placeholder="600 000 000"
                            required
                        />
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
                    <div className="grid grid-cols-2 gap-4">
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

            <div className="flex justify-between items-center pt-6">
                <button type="button" onClick={onBack} className="text-primary hover:text-primary-dark font-medium pb-1 border-b border-transparent hover:border-primary transition-all">
                    &lt; Volver al carrito
                </button>
                <button
                    type="submit"
                    className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark shadow-lg shadow-green-100 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
                >
                    Continuar a Envío &rarr;
                </button>
            </div>
        </form>
    );
}
