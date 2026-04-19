import React, { useEffect, useState } from "react";
import TextInput from "@/Components/TextInput/TextInput";
import InputLabel from "@/Components/InputLabel/InputLabel";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import es from "react-phone-input-2/lang/es.json";
import styles from "./InfoStep.module.css";

const SPANISH_POSTAL_CODES = {
    "28": "Madrid",
    "08": "Barcelona",
    "41": "Sevilla",
    "46": "Valencia",
    "29": "Málaga",
    "30": "Murcia",
    "07": "Palma de Mallorca",
    "50": "Zaragoza",
    "35": "Las Palmas de Gran Canaria",
    "38": "Santa Cruz de Tenerife",
};

function StepSection({ badge, badgeVariant = "secondary", title, children }) {
    const badgeClassName =
        badgeVariant === "primary" ? styles.sectionBadgePrimary : styles.sectionBadgeSecondary;

    return (
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <div className={`${styles.sectionBadge} ${badgeClassName}`}>{badge}</div>
                <h3 className={styles.sectionTitle}>{title}</h3>
                <div className={styles.sectionDivider}></div>
            </div>
            <div className={styles.sectionContent}>{children}</div>
        </section>
    );
}

function FormField({ label, htmlFor, children, error }) {
    return (
        <div className={styles.field}>
            <InputLabel htmlFor={htmlFor} value={label} className={styles.label} />
            {children}
            {error ? <div className={styles.errorText}>{error}</div> : null}
        </div>
    );
}

export default function InfoStep({ data, setData, onNext, onBack, user, errors }) {
    const [dniError, setDniError] = useState("");

    useEffect(() => {
        if (user) {
            if (!data.first_name) setData("first_name", user.name || "");
            if (!data.email) setData("email", user.email || "");
            if (!data.dni) setData("dni", user.dni || "");
        }
    }, [user, data.first_name, data.email, data.dni, setData]);

    const validateDNI = (value) => {
        const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
        const trimmed = value.toUpperCase().replace(/\s/g, "");

        if (!/^[XYZ0-9][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/.test(trimmed)) {
            return false;
        }

        let number = trimmed.substring(0, 8);
        const letter = trimmed.charAt(8);

        number = number.replace("X", "0").replace("Y", "1").replace("Z", "2");

        const expectedLetter = letters.charAt(parseInt(number, 10) % 23);
        return letter === expectedLetter;
    };

    const autoFill = () => {
        const testData = {
            first_name: "Juan",
            last_name: "Pérez",
            email: "juan.perez@example.com",
            dni: "12345678Z",
            phone: "34622222222",
            address: "Calle Mayor 1",
            city: "Madrid",
            postal_code: "28001",
            country: "España",
        };

        Object.entries(testData).forEach(([key, value]) => {
            setData(key, value);
        });

        setDniError("");
    };

    const handlePostalCodeChange = (event) => {
        const value = event.target.value;
        setData("postal_code", value);

        if (value.length >= 2) {
            const prefix = value.substring(0, 2);

            if (SPANISH_POSTAL_CODES[prefix]) {
                setData("city", SPANISH_POSTAL_CODES[prefix]);
            }
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setData(name, value);

        if (name === "dni") {
            if (value && !validateDNI(value)) {
                setDniError("DNI/NIE no válido");
            } else {
                setDniError("");
            }
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (data.dni && !validateDNI(data.dni)) {
            setDniError("Por favor, introduce un DNI/NIE válido antes de continuar.");
            return;
        }

        onNext();
    };

    return (
        <form onSubmit={handleSubmit} className={styles.root}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Información</h2>
                    <p className={styles.stepMeta}>Paso 2 de 4</p>
                </div>

                <button type="button" onClick={autoFill} className={styles.autoFillButton}>
                    <svg className={styles.iconXs} fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Auto-completar
                </button>
            </div>

            <StepSection badge="A" title="Datos Personales">
                <div className={styles.twoColumnGrid}>
                    <FormField label="Nombre" htmlFor="first_name">
                        <TextInput
                            id="first_name"
                            name="first_name"
                            value={data.first_name}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="Tu nombre"
                            required
                        />
                    </FormField>

                    <FormField label="Apellidos" htmlFor="last_name">
                        <TextInput
                            id="last_name"
                            name="last_name"
                            value={data.last_name}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="Tus apellidos"
                            required
                        />
                    </FormField>
                </div>

                <FormField label="Correo Electrónico" htmlFor="email" error={errors.email}>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="tu@email.com"
                        required
                    />
                </FormField>

                <div className={styles.twoColumnGrid}>
                    <FormField label="DNI / NIE" htmlFor="dni" error={dniError}>
                        <TextInput
                            id="dni"
                            name="dni"
                            value={data.dni}
                            onChange={handleChange}
                            className={`${styles.input} ${dniError ? styles.inputError : ""}`}
                            placeholder="12345678X"
                            required
                        />
                    </FormField>

                    <FormField label="Teléfono" htmlFor="phone">
                        <div className={styles.phoneField}>
                            <PhoneInput
                                country="es"
                                value={data.phone || ""}
                                onChange={(phone) => setData("phone", phone)}
                                localization={es}
                                enableSearch
                                containerClass={styles.phoneContainer}
                                inputClass={styles.phoneInput}
                                buttonClass={styles.phoneButton}
                                dropdownClass={styles.phoneDropdown}
                                searchClass={styles.phoneSearch}
                                inputProps={{
                                    required: true,
                                    name: "phone",
                                }}
                            />
                        </div>
                    </FormField>
                </div>
            </StepSection>

            <StepSection badge="B" badgeVariant="primary" title="Dirección de Envío">
                <FormField label="Calle y número" htmlFor="address">
                    <TextInput
                        id="address"
                        name="address"
                        value={data.address}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Ej: Calle Gran Vía 12, 4º B"
                        required
                    />
                </FormField>

                <div className={styles.twoColumnGrid}>
                    <FormField label="Ciudad" htmlFor="city">
                        <TextInput
                            id="city"
                            name="city"
                            value={data.city}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="Tu ciudad"
                            required
                        />
                    </FormField>

                    <FormField label="Código Postal" htmlFor="postal_code">
                        <TextInput
                            id="postal_code"
                            name="postal_code"
                            value={data.postal_code}
                            onChange={handlePostalCodeChange}
                            className={styles.input}
                            placeholder="28001"
                            required
                        />
                    </FormField>
                </div>

                <FormField label="País" htmlFor="country">
                    <TextInput
                        id="country"
                        name="country"
                        value={data.country}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="España"
                        required
                    />
                </FormField>
            </StepSection>

            <div className={styles.actions}>
                <button type="button" onClick={onBack} className={styles.secondaryButton}>
                    <span className={styles.backArrow}>&larr;</span>
                    Volver al Carrito
                </button>

                <button type="submit" className={styles.primaryButton}>
                    CONTINUAR A ENVÍO
                    <svg className={styles.iconMdForward} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </form>
    );
}
