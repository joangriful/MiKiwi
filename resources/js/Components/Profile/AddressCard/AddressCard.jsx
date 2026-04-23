import React, { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import es from 'react-phone-input-2/lang/es.json';
import styles from './AddressCard.module.css';

const SPANISH_CITIES = [
    { city: 'Madrid', province: 'Madrid' }, { city: 'Málaga', province: 'Málaga' }, { city: 'Murcia', province: 'Murcia' },
    { city: 'Móstoles', province: 'Madrid' }, { city: 'Majadahonda', province: 'Madrid' }, { city: 'Marbella', province: 'Málaga' },
    { city: 'Mataró', province: 'Barcelona' }, { city: 'Mérida', province: 'Badajoz' }, { city: 'Melilla', province: 'Melilla' },
    { city: 'Barcelona', province: 'Barcelona' }, { city: 'Bilbao', province: 'Bizkaia' }, { city: 'Burgos', province: 'Burgos' },
    { city: 'Badalona', province: 'Barcelona' }, { city: 'Benidorm', province: 'Alicante' },
    { city: 'Valencia', province: 'Valencia' }, { city: 'Valladolid', province: 'Valladolid' }, { city: 'Vigo', province: 'Pontevedra' },
    { city: 'Vitoria-Gasteiz', province: 'Araba/Álava' },
    { city: 'Sevilla', province: 'Sevilla' }, { city: 'Santander', province: 'Cantabria' }, { city: 'Salamanca', province: 'Salamanca' },
    { city: 'Segovia', province: 'Segovia' }, { city: 'San Sebastián', province: 'Gipuzkoa' },
    { city: 'Zaragoza', province: 'Zaragoza' }, { city: 'Zamora', province: 'Zamora' },
    { city: 'Alicante', province: 'Alicante' }, { city: 'Almería', province: 'Almería' }, { city: 'Albacete', province: 'Albacete' },
    { city: 'Alcorcón', province: 'Madrid' }, { city: 'Alcobendas', province: 'Madrid' }, { city: 'Algeciras', province: 'Cádiz' },
    { city: 'A Coruña', province: 'A Coruña' }, { city: 'Córdoba', province: 'Córdoba' }, { city: 'Cádiz', province: 'Cádiz' },
    { city: 'Castellón de la Plana', province: 'Castellón' }, { city: 'Cartagena', province: 'Murcia' },
    { city: 'Granada', province: 'Granada' }, { city: 'Gijón', province: 'Asturias' }, { city: 'Girona', province: 'Girona' },
    { city: 'Guadalajara', province: 'Guadalajara' },
    { city: 'Toledo', province: 'Toledo' }, { city: 'Tarragona', province: 'Tarragona' }, { city: 'Torrevieja', province: 'Alicante' },
    { city: 'Terrassa', province: 'Barcelona' },
    { city: 'Palma', province: 'Illes Balears' }, { city: 'Pamplona', province: 'Navarra' }, { city: 'Palencia', province: 'Palencia' },
    { city: 'Pontevedra', province: 'Pontevedra' },
    { city: 'Oviedo', province: 'Asturias' }, { city: 'Ourense', province: 'Ourense' },
    { city: 'Huelva', province: 'Huelva' }, { city: 'Huesca', province: 'Huesca' },
    { city: 'Jaén', province: 'Jaén' }, { city: 'Jerez de la Frontera', province: 'Cádiz' },
    { city: 'León', province: 'León' }, { city: 'Lleida', province: 'Lleida' }, { city: 'Logroño', province: 'La Rioja' },
    { city: 'Lugo', province: 'Lugo' }, { city: 'Leganés', province: 'Madrid' },
    { city: 'Soria', province: 'Soria' },
    { city: 'Teruel', province: 'Teruel' },
    { city: 'Cuenca', province: 'Cuenca' },
    { city: 'Cáceres', province: 'Cáceres' },
    { city: 'Badajoz', province: 'Badajoz' },
];

export default function AddressCard({ address, onSave, onDelete, onSetDefault, isDefault }) {
    const [isEditing, setIsEditing] = useState(address.isNew || false);
    const [formData, setFormData] = useState({ ...address });
    const [suggestions, setSuggestions] = useState([]);
    const fieldIdPrefix = `address-${address.id}`;

    useEffect(() => {
        if (formData.zip && formData.zip.length === 5) {
            fetch(`https://api.zippopotam.us/es/${formData.zip}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Zip not found');
                    }

                    return response.json();
                })
                .then((data) => {
                    if (data.places && data.places.length > 0) {
                        const place = data.places[0];

                        setFormData((previous) => ({
                            ...previous,
                            city: place['place name'],
                            state: place.state,
                        }));
                    }
                })
                .catch(() => {});
        }
    }, [formData.zip]);

    const handleCityChange = (event) => {
        const { value } = event.target;

        setFormData((previous) => ({ ...previous, city: value }));

        if (value.length > 1) {
            const filteredSuggestions = SPANISH_CITIES.filter((item) =>
                item.city.toLowerCase().startsWith(value.toLowerCase()),
            );

            setSuggestions(filteredSuggestions);
            return;
        }

        setSuggestions([]);
    };

    const selectCity = (item) => {
        setFormData((previous) => ({
            ...previous,
            city: item.city,
            state: item.province,
        }));
        setSuggestions([]);
    };

    const handleSuggestionKeyDown = (event, item) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            selectCity(item);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
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

    const handleSave = () => {
        onSave(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        if (address.isNew) {
            onDelete(address.id);
            return;
        }

        setFormData({ ...address });
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className={`${styles.root} ${styles.editorCard}`}>
                <h3 className={styles.editorTitle}>
                    {address.isNew ? 'Añadir nueva dirección' : 'Editar dirección'}
                </h3>

                <div className={styles.formGrid}>
                    <div className={styles.fullWidthField}>
                        <label htmlFor={`${fieldIdPrefix}-name`} className={styles.label}>Nombre completo / Etiqueta</label>
                        <input
                            id={`${fieldIdPrefix}-name`}
                            aria-label="Nombre completo o etiqueta de la dirección"
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            placeholder="Ej. Casa, Trabajo, Juan Pérez"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.fullWidthField}>
                        <label htmlFor={`${fieldIdPrefix}-street`} className={styles.label}>Dirección</label>
                        <input
                            id={`${fieldIdPrefix}-street`}
                            aria-label="Dirección"
                            type="text"
                            name="street"
                            value={formData.street || ''}
                            onChange={handleChange}
                            placeholder="Calle, número, piso..."
                            className={styles.input}
                        />
                    </div>

                    <div>
                        <label htmlFor={`${fieldIdPrefix}-zip`} className={styles.label}>Código Postal</label>
                        <input
                            id={`${fieldIdPrefix}-zip`}
                            aria-label="Código postal"
                            type="text"
                            name="zip"
                            value={formData.zip || ''}
                            onChange={handleChange}
                            maxLength={5}
                            placeholder="Ej. 28001"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.autocompleteField}>
                        <label htmlFor={`${fieldIdPrefix}-city`} className={styles.label}>Ciudad</label>
                        <input
                            id={`${fieldIdPrefix}-city`}
                            aria-label="Ciudad"
                            type="text"
                            name="city"
                            value={formData.city || ''}
                            onChange={handleCityChange}
                            onBlur={() => setTimeout(() => setSuggestions([]), 200)}
                            className={styles.input}
                            autoComplete="off"
                        />

                        {suggestions.length > 0 && (
                            <ul className={styles.suggestions} role="listbox">
                                {suggestions.map((item) => (
                                    <li
                                        key={`${item.city}-${item.province}`}
                                        role="option"
                                        aria-selected={formData.city === item.city}
                                        tabIndex={0}
                                        onClick={() => selectCity(item)}
                                        onKeyDown={(event) => handleSuggestionKeyDown(event, item)}
                                        className={styles.suggestionItem}
                                    >
                                        {item.city}
                                        <span className={styles.suggestionMeta}>({item.province})</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <label htmlFor={`${fieldIdPrefix}-state`} className={styles.label}>Provincia</label>
                        <input
                            id={`${fieldIdPrefix}-state`}
                            aria-label="Provincia"
                            type="text"
                            name="state"
                            value={formData.state || ''}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    <div>
                        <label htmlFor={`${fieldIdPrefix}-phone`} className={styles.label}>Teléfono móvil</label>
                        <PhoneInput
                            country="es"
                            value={formData.phone || ''}
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
                            inputProps={{
                                id: `${fieldIdPrefix}-phone`,
                                name: 'phone',
                                'aria-label': 'Teléfono móvil',
                            }}
                        />
                    </div>
                </div>

                <div className={styles.actions}>
                    <button onClick={handleCancel} className={styles.cancelButton}>
                        Cancelar
                    </button>
                    <button onClick={handleSave} className={styles.saveButton}>
                        Guardar Dirección
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.root} ${styles.card} ${isDefault ? styles.cardDefault : styles.cardStandard}`}>
            <div className={styles.cardBody}>
                <div>
                    <h3 className={styles.cardTitle}>
                        {address.name}
                        {isDefault && (
                            <span className={styles.defaultBadge}>Predeterminada</span>
                        )}
                    </h3>
                    <p className={styles.cardLine}>{address.street}</p>
                    <p className={styles.cardLine}>{address.city}, {address.state} {address.zip}</p>
                    <p className={styles.cardPhone}>{address.phone}</p>
                </div>

                <div className={styles.cardActions}>
                    <button onClick={() => setIsEditing(true)} className={styles.editButton}>
                        Editar
                    </button>

                    {!isDefault && (
                        <>
                            <button onClick={() => onSetDefault(address.id)} className={styles.selectButton}>
                                Seleccionar
                            </button>
                            <button onClick={() => onDelete(address.id)} className={styles.deleteButton}>
                                Eliminar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
