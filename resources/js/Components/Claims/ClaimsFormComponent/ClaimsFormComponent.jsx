import { Link } from "@inertiajs/react";
import useClaimsForm from "@/Components/Claims/hooks/useClaimsForm";
import { CLAIM_REASONS } from "@/Components/Claims/utils/claimReasons";
import styles from "./ClaimsFormComponent.module.css";

export default function ClaimsFormComponent() {
    const {
        formData,
        submitted,
        referenceNumber,
        handleChange,
        handleSubmit,
        toggleTerms,
    } = useClaimsForm();

    if (submitted) {
        return <ClaimSuccess email={formData.email} referenceNumber={referenceNumber} />;
    }

    return (
        <section className={styles.root} aria-labelledby="claims_form_title">
            <ClaimsFormHeader />
            <LegalNotice />

            <form onSubmit={handleSubmit} className={styles.form}>
                <FormSection title="Datos personales">
                    <div className={styles.twoColumnGrid}>
                        <FormField label="Nombre completo" htmlFor="name" required>
                            <input
                                id="name"
                                aria-label="Nombre completo"
                                type="text"
                                name="name"
                                required
                                className={styles.input}
                                placeholder="Tu nombre y apellidos"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </FormField>

                        <FormField label="Correo electrónico" htmlFor="email" required>
                            <input
                                id="email"
                                aria-label="Correo electrónico"
                                type="email"
                                name="email"
                                required
                                className={styles.input}
                                placeholder="tu@email.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </FormField>

                        <FormField label="Teléfono de contacto" htmlFor="phone">
                            <input
                                id="phone"
                                aria-label="Teléfono de contacto"
                                type="tel"
                                name="phone"
                                className={styles.input}
                                placeholder="+34 000 000 000"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </FormField>

                        <FormField label="Número de pedido" htmlFor="orderId">
                            <input
                                id="orderId"
                                aria-label="Número de pedido"
                                type="text"
                                name="orderId"
                                className={styles.input}
                                placeholder="#MK-000000"
                                value={formData.orderId}
                                onChange={handleChange}
                            />
                        </FormField>
                    </div>
                </FormSection>

                <FormSection title="Detalle de la reclamación">
                    <FormField label="Motivo de la reclamación" htmlFor="reason" required>
                        <select
                            id="reason"
                            aria-label="Motivo de la reclamación"
                            name="reason"
                            required
                            className={styles.select}
                            value={formData.reason}
                            onChange={handleChange}
                        >
                            {CLAIM_REASONS.map((reason) => (
                                <option key={reason.value} value={reason.value}>
                                    {reason.label}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <FormField label="Descripción detallada" htmlFor="message" required>
                        <textarea
                            id="message"
                            aria-label="Descripción detallada"
                            name="message"
                            required
                            rows="5"
                            className={styles.textarea}
                            placeholder="Describe el problema con el mayor detalle posible. Incluye fechas, importes y cualquier información relevante..."
                            value={formData.message}
                            onChange={handleChange}
                        />
                        <p className={styles.fieldHint}>
                            Cuantos más detalles incluyas, antes podremos resolver tu caso.
                        </p>
                    </FormField>
                </FormSection>

                <PrivacyConsent
                    checked={formData.terms}
                    onChange={handleChange}
                    onToggle={toggleTerms}
                />

                <FormActions />
            </form>
        </section>
    );
}

function ClaimsFormHeader() {
    return (
        <header className={styles.header}>
            <h2 id="claims_form_title" className={styles.formTitle}>
                Formulario de Reclamaciones
            </h2>
            <p className={styles.formIntro}>
                Lamentamos que hayas tenido una incidencia. Rellena los datos y nuestro equipo se pondrá en contacto
                contigo en un plazo máximo de <strong>48 horas hábiles</strong>.
            </p>
        </header>
    );
}

function LegalNotice() {
    return (
        <aside className={styles.legalNotice}>
            <p>
                <strong>Información sobre la resolución de litigios.</strong> De conformidad con el Reglamento (UE)
                n.o 524/2013 sobre resolución de litigios en línea en materia de consumo, la Comisión Europea pone a
                disposición una plataforma de resolución en línea accesible en{" "}
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
                    ec.europa.eu/consumers/odr
                </a>
                .
            </p>
        </aside>
    );
}

function FormSection({ title, children }) {
    return (
        <section className={styles.section}>
            <h3 className={styles.sectionTitle}>{title}</h3>
            {children}
        </section>
    );
}

function FormField({ label, htmlFor, required = false, children }) {
    return (
        <div className={styles.field}>
            <label htmlFor={htmlFor} className={styles.label}>
                {label} {required ? <span aria-hidden="true">*</span> : null}
            </label>
            {children}
        </div>
    );
}

function PrivacyConsent({ checked, onChange, onToggle }) {
    return (
        <div className={styles.privacyRow}>
            <input
                id="terms"
                aria-label="Aceptar política de privacidad"
                type="checkbox"
                name="terms"
                className={styles.checkboxInput}
                checked={checked}
                onChange={onChange}
            />
            <button
                type="button"
                className={`${styles.checkboxVisual} ${checked ? styles.checkboxVisualChecked : ""}`}
                onClick={onToggle}
                aria-label="Aceptar política de privacidad"
                aria-pressed={checked}
            >
                {checked ? (
                    <svg className={styles.iconXs} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                    </svg>
                ) : null}
            </button>
            <label htmlFor="terms" className={styles.privacyText}>
                He leído y acepto la{" "}
                <Link href={route("privacy.policy")}>Política de Privacidad</Link>{" "}
                y autorizo el tratamiento de mis datos personales para la gestión de esta reclamación, de conformidad
                con el RGPD (UE) 2016/679.
            </label>
        </div>
    );
}

function FormActions() {
    return (
        <footer className={styles.actions}>
            <p>
                Respondemos en un plazo máximo de <strong>48 horas hábiles</strong>.
            </p>
            <button type="submit" className={styles.submitButton}>
                Enviar Reclamación
            </button>
        </footer>
    );
}

function ClaimSuccess({ email, referenceNumber }) {
    return (
        <section className={styles.successRoot} aria-labelledby="claim_success_title">
            <div className={styles.successIcon}>
                <svg className={styles.iconLg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 id="claim_success_title" className={styles.successTitle}>
                Reclamación registrada
            </h2>
            <p className={styles.successText}>
                Tu reclamación ha sido registrada correctamente. Recibirás una confirmación en <strong>{email}</strong>{" "}
                y nos pondremos en contacto contigo en un plazo máximo de <strong>48 horas hábiles</strong>.
            </p>
            <p className={styles.successReference}>
                Número de referencia: <strong>{referenceNumber}</strong>. Guárdalo para futuras consultas.
            </p>
            <Link href={route("home")} className={styles.homeLink}>
                Volver al inicio
            </Link>
        </section>
    );
}
