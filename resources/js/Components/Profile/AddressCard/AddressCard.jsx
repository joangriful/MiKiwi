import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import es from 'react-phone-input-2/lang/es.json';
import styles from './AddressCard.module.css';

export default function AddressCard({ address, onSave, onDelete, onSetDefault, isDefault }) {
    const [isEditing, setIsEditing] = useState(address.isNew || false);
    const [formData, setFormData] = useState({ ...address });
    const [suggestions, setSuggestions] = useState([]);

    // ... (rest of the component logic remains same until render) ...
    // Note: I need to be careful with replace_file_content to not duplicate code or miss parts if I use a large range.
    // The previous tool usage replaced the top part. I should target the imports and the phone input specifically?
    // But I can't do multiple disjoint edits easily with replace_file_content unless I use multi_replace.
    // Let's use multi_replace to add imports and replace the input.

    // WAIT, I cannot use multi_replace if I am just using replace_file_content here.
    // I will use multi_replace_file_content instead to be safe and precise.
    // Re-reading the prompt: "replace_file_content" was selected.
    // I will switch to multi_replace to handle imports at top and input at bottom.



    // Mock/Static list of major Spanish cities with their provinces
    const spanishCities = [
        { city: "Madrid", province: "Madrid" }, { city: "Málaga", province: "Málaga" }, { city: "Murcia", province: "Murcia" },
        { city: "Móstoles", province: "Madrid" }, { city: "Majadahonda", province: "Madrid" }, { city: "Marbella", province: "Málaga" },
        { city: "Mataró", province: "Barcelona" }, { city: "Mérida", province: "Badajoz" }, { city: "Melilla", province: "Melilla" },
        { city: "Barcelona", province: "Barcelona" }, { city: "Bilbao", province: "Bizkaia" }, { city: "Burgos", province: "Burgos" },
        { city: "Badalona", province: "Barcelona" }, { city: "Benidorm", province: "Alicante" },
        { city: "Valencia", province: "Valencia" }, { city: "Valladolid", province: "Valladolid" }, { city: "Vigo", province: "Pontevedra" },
        { city: "Vitoria-Gasteiz", province: "Araba/Álava" },
        { city: "Sevilla", province: "Sevilla" }, { city: "Santander", province: "Cantabria" }, { city: "Salamanca", province: "Salamanca" },
        { city: "Segovia", province: "Segovia" }, { city: "San Sebastián", province: "Gipuzkoa" },
        { city: "Zaragoza", province: "Zaragoza" }, { city: "Zamora", province: "Zamora" },
        { city: "Alicante", province: "Alicante" }, { city: "Almería", province: "Almería" }, { city: "Albacete", province: "Albacete" },
        { city: "Alcorcón", province: "Madrid" }, { city: "Alcobendas", province: "Madrid" }, { city: "Algeciras", province: "Cádiz" },
        { city: "A Coruña", province: "A Coruña" }, { city: "Córdoba", province: "Córdoba" }, { city: "Cádiz", province: "Cádiz" },
        { city: "Castellón de la Plana", province: "Castellón" }, { city: "Cartagena", province: "Murcia" },
        { city: "Granada", province: "Granada" }, { city: "Gijón", province: "Asturias" }, { city: "Girona", province: "Girona" },
        { city: "Guadalajara", province: "Guadalajara" },
        { city: "Toledo", province: "Toledo" }, { city: "Tarragona", province: "Tarragona" }, { city: "Torrevieja", province: "Alicante" },
        { city: "Terrassa", province: "Barcelona" },
        { city: "Palma", province: "Illes Balears" }, { city: "Pamplona", province: "Navarra" }, { city: "Palencia", province: "Palencia" },
        { city: "Pontevedra", province: "Pontevedra" },
        { city: "Oviedo", province: "Asturias" }, { city: "Ourense", province: "Ourense" },
        { city: "Huelva", province: "Huelva" }, { city: "Huesca", province: "Huesca" },
        { city: "Jaén", province: "Jaén" }, { city: "Jerez de la Frontera", province: "Cádiz" },
        { city: "León", province: "León" }, { city: "Lleida", province: "Lleida" }, { city: "Logroño", province: "La Rioja" },
        { city: "Lugo", province: "Lugo" }, { city: "Leganés", province: "Madrid" },
        { city: "Soria", province: "Soria" },
        { city: "Teruel", province: "Teruel" },
        { city: "Cuenca", province: "Cuenca" },
        { city: "Cáceres", province: "Cáceres" },
        { city: "Badajoz", province: "Badajoz" }
    ];

    // Auto-fill from Zip
    React.useEffect(() => {
        if (formData.zip && formData.zip.length === 5) {
            fetch(`https://api.zippopotam.us/es/${formData.zip}`)
                .then(response => {
                    if (!response.ok) throw new Error('Zip not found');
                    return response.json();
                })
                .then(data => {
                    if (data.places && data.places.length > 0) {
                        const place = data.places[0];
                        setFormData(prev => ({
                            ...prev,
                            city: place['place name'],
                            state: place['state'] // Community/Province
                        }));
                    }
                })
                .catch(() => {
                    // Keep manual city/state input when zip lookup fails.
                });
        }
    }, [formData.zip]);

    const handleCityChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, city: value }));

        if (value.length > 1) {
            const filtered = spanishCities.filter(item =>
                item.city.toLowerCase().startsWith(value.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const selectToCity = (item) => {
        setFormData(prev => ({
            ...prev,
            city: item.city,
            state: item.province
        }));
        setSuggestions([]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        if (address.isNew) {
            onDelete(address.id); // Cancel creation
        } else {
            setFormData({ ...address }); // Reset to original
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <div className={`${styles.root} bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-4`}>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {address.isNew ? 'Añadir nueva dirección' : 'Editar dirección'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo / Etiqueta</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            placeholder="Ej. Casa, Trabajo, Juan Pérez"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#99b849] focus:border-[#99b849]"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                        <input
                            type="text"
                            name="street"
                            value={formData.street || ''}
                            onChange={handleChange}
                            placeholder="Calle, número, piso..."
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#99b849] focus:border-[#99b849]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                        <input
                            type="text"
                            name="zip"
                            value={formData.zip || ''}
                            onChange={handleChange}
                            maxLength={5}
                            placeholder="Ej. 28001"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#99b849] focus:border-[#99b849]"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city || ''}
                            onChange={handleCityChange}
                            onBlur={() => setTimeout(() => setSuggestions([]), 200)} // Delay hide to allow click
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#99b849] focus:border-[#99b849]"
                            autoComplete="off"
                        />
                        {suggestions.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto mt-1">
                                {suggestions.map((item, index) => (
                                    <li
                                        key={index}
                                        onClick={() => selectToCity(item)}
                                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                                    >
                                        {item.city} <span className="text-gray-400 text-xs ml-1">({item.province})</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state || ''}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#99b849] focus:border-[#99b849]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono móvil</label>
                        <PhoneInput
                            country={'es'}
                            value={formData.phone || ''}
                            onChange={(phone, data) => {
                                // Smart Delete Logic:
                                // If user clears input (select all + delete), or deletes prefix:
                                // Restore the dialCode to ensure prefix remains visual in button.
                                if (data && data.dialCode) {
                                    if (!phone || phone === data.dialCode) {
                                        // If empty or just dial code, ensure state is just dial code
                                        // This keeps the prefix in the button and input empty (correct for separateDialCode)
                                        setFormData(prev => ({ ...prev, phone: data.dialCode }));
                                        return;
                                    }
                                    // If phone doesn't start with dialCode, it means they deleted part of prefix
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
                                left: '-9999px' // Move off-screen to ensure it doesn't take space but stays in DOM
                            }}
                            inputStyle={{
                                width: '100%',
                                height: '42px',
                                fontSize: '16px',
                                paddingLeft: '48px', // Tighter padding as requested
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
                                borderRadius: '12px', // Rounded corners
                                marginTop: '4px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                            }}
                            separateDialCode={true}
                            enableLongNumbers={false} // Ensure standard behavior
                        />
                        <style>{`
                            /* Hide Scrollbar */
                            .react-tel-input .country-list::-webkit-scrollbar {
                                display: none;
                            }
                            .react-tel-input .country-list {
                                -ms-overflow-style: none; /* IE and Edge */
                                scrollbar-width: none; /* Firefox */
                            }

                            /* Reorder Dropdown Items: Flag -> Code -> Name */
                            .react-tel-input .country-list .country {
                                display: flex;
                                align-items: center;
                                padding: 12px 15px !important;
                                transition: background-color 0.2s;
                            }
                            .react-tel-input .country-list .country:hover {
                                background-color: #f9fafb !important;
                            }
                            .react-tel-input .country-list .country .flag {
                                order: 1;
                                margin-right: 12px !important;
                                transform: scale(1.2);
                            }
                            .react-tel-input .country-list .country .dial-code {
                                order: 2;
                                font-weight: 600;
                                color: #374151;
                                margin-right: 8px;
                            }
                            .react-tel-input .country-list .country .search {
                                order: 3; /* Wait, search box is outside country list usually, but this is for country name span */
                            }
                            .react-tel-input .country-list .country .country-name {
                                order: 3;
                                color: #6b7280;
                            }

                            /* Clean up selected active state */
                            .react-tel-input .country-list .country.highlight {
                                background-color: #f3f4f6 !important;
                            }

                            /* Fix Hover Border Radius Issue */
                            .react-tel-input .selected-flag {
                                border-radius: 0.5rem 0 0 0.5rem !important;
                            }
                            .react-tel-input .selected-flag:hover,
                            .react-tel-input .selected-flag:focus {
                                background-color: #f3f4f6 !important;
                                border-radius: 0.5rem 0 0 0.5rem !important;
                            }
                        `}</style>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-[#99b849] hover:bg-[#8da843] text-white rounded-lg shadow-sm transition-all"
                    >
                        Guardar Dirección
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.root} bg-white border rounded-xl p-6 shadow-sm mb-4 relative transition-all ${isDefault ? 'border-[#99b849] ring-1 ring-[#99b849]' : 'border-gray-200 hover:border-gray-300'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                        {address.name}
                        {isDefault && (
                            <span className="bg-[#99b849]/10 text-[#99b849] text-xs px-2 py-0.5 rounded-full font-semibold">Predeterminada</span>
                        )}
                    </h3>
                    <p className="text-gray-600">{address.street}</p>
                    <p className="text-gray-600">{address.city}, {address.state} {address.zip}</p>
                    <p className="text-gray-500 mt-2 text-sm">{address.phone}</p>
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1 text-sm bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg border border-gray-200 transition-colors"
                    >
                        Editar
                    </button>
                    {!isDefault && (
                        <>
                            <button
                                onClick={() => onSetDefault(address.id)}
                                className="px-3 py-1 text-sm text-[#99b849] hover:bg-[#99b849]/5 rounded-lg transition-colors"
                            >
                                Seleccionar
                            </button>
                            <button
                                onClick={() => onDelete(address.id)}
                                className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                Eliminar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
