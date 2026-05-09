import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { toast } from 'react-toastify';
import MarketingPageLayout from '@/Components/Marketing/MarketingPageLayout/MarketingPageLayout';
import { normalizeInertiaErrors } from '@/Utils/httpError';
import styles from './Contact.module.css';

export default function Contact() {
    const contactForm = useForm({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const newsletterForm = useForm({
        email: '',
        gender: '',
        terms: false,
    });

    const newsletterError = normalizeInertiaErrors(newsletterForm.errors, {
        title: 'No pudimos completar la suscripción',
        message: 'No pudimos completar tu suscripción en este momento. Inténtalo de nuevo en unos minutos.',
        code: 'newsletter_subscription_failed',
    });

    const submitContact = (event) => {
        event.preventDefault();
        toast.success('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', {
            position: 'bottom-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'colored',
        });
        contactForm.reset();
    };

    const submitNewsletter = (event) => {
        event.preventDefault();

        if (!newsletterForm.data.gender) {
            toast.warning('Por favor, selecciona si tienes vulva o pene.');
            return;
        }

        if (!newsletterForm.data.terms) {
            toast.warning('Debes aceptar la política de privacidad para suscribirte.');
            return;
        }

        newsletterForm.post(route('newsletter.subscribe'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('¡Gracias por suscribirte!');
                newsletterForm.reset();
            },
            onError: () => {},
        });
    };

    return (
        <MarketingPageLayout title="Contacto" maxWidth="wide" showBreadcrumb={false}>
            <form className={styles.contactForm} onSubmit={submitContact}>
                <div className={styles.formGrid}>
                    <label>
                        <span className={styles.screenReaderOnly}>Nombre</span>
                        <input
                            aria-label="Nombre"
                            type="text"
                            placeholder="Nombre"
                            value={contactForm.data.name}
                            onChange={(event) => contactForm.setData('name', event.target.value)}
                        />
                    </label>
                    <label>
                        <span className={styles.screenReaderOnly}>Correo electrónico</span>
                        <input
                            aria-label="Correo electrónico"
                            required
                            type="email"
                            placeholder="Correo electrónico *"
                            value={contactForm.data.email}
                            onChange={(event) => contactForm.setData('email', event.target.value)}
                        />
                    </label>
                </div>
                <label>
                    <span className={styles.screenReaderOnly}>Número de teléfono</span>
                    <input
                        aria-label="Número de teléfono"
                        type="tel"
                        placeholder="Número de teléfono"
                        value={contactForm.data.phone}
                        onChange={(event) => contactForm.setData('phone', event.target.value)}
                    />
                </label>
                <label>
                    <span className={styles.screenReaderOnly}>Comentario</span>
                    <textarea
                        aria-label="Comentario"
                        rows="4"
                        placeholder="Comentario"
                        value={contactForm.data.message}
                        onChange={(event) => contactForm.setData('message', event.target.value)}
                    />
                </label>
                <button disabled={contactForm.processing} type="submit">
                    {contactForm.processing ? 'Enviando...' : 'Enviar'}
                </button>
            </form>

            <div className={styles.bottomGrid}>
                <form className={styles.newsletter} onSubmit={submitNewsletter}>
                    <div>
                        <h2>Suscríbete a nuestra Newsletter</h2>
                        <p>Recibe <strong>contenido de nuestrxs sexólogxs, novedades y ofertas.</strong> ¡Será todo un placer!</p>

                        <fieldset className={styles.radioGroup}>
                            <legend>¿Tienes vulva o pene?</legend>
                            {['vulva', 'pene'].map((option) => (
                                <label key={option}>
                                    <input
                                        checked={newsletterForm.data.gender === option}
                                        name="gender"
                                        aria-label={option}
                                        type="radio"
                                        onChange={() => newsletterForm.setData('gender', option)}
                                    />
                                    <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
                                </label>
                            ))}
                        </fieldset>

                        <label>
                            <span className={styles.screenReaderOnly}>Email de suscripción</span>
                            <input
                                aria-label="Email de suscripción"
                                required
                                type="email"
                                placeholder="Email"
                                value={newsletterForm.data.email}
                                onChange={(event) => newsletterForm.setData('email', event.target.value)}
                            />
                        </label>

                        {newsletterError.fieldErrors ? (
                            <p className={styles.errorText}>{newsletterError.message}</p>
                        ) : null}

                        <label className={styles.checkbox}>
                            <input
                                checked={newsletterForm.data.terms}
                                aria-label="Aceptar la política de privacidad"
                                type="checkbox"
                                onChange={() => newsletterForm.setData('terms', !newsletterForm.data.terms)}
                            />
                            <span>Acepto la política de privacidad.</span>
                        </label>
                    </div>

                    <div>
                        <button disabled={newsletterForm.processing} type="submit">
                            {newsletterForm.processing ? 'Suscribiendo...' : 'Suscribirme'}
                        </button>
                        <p className={styles.finePrint}>Puedes darte de baja cuando quieras.</p>
                    </div>
                </form>

                <section className={styles.help}>
                    <h2>¿Necesitas ayuda?</h2>
                    <div className={styles.helpCards}>
                        <article>
                            <p>Consulta nuestras preguntas frecuentes</p>
                            <Link href={route('faq')}>FAQs</Link>
                        </article>
                        <article>
                            <p>Deja un mensaje a nuestro equipo experto</p>
                            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} type="button">
                                Hazlo aquí
                            </button>
                        </article>
                    </div>

                    <div className={styles.helpLinks}>
                        {['Tarifas y plazos de envío', 'Incidencias o devoluciones', 'Contacta con nosotras'].map((label) => (
                            <Link href={route('faq')} key={label}>
                                <span>{label}</span>
                                <span aria-hidden="true">→</span>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </MarketingPageLayout>
    );
}
