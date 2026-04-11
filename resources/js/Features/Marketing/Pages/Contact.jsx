import React from 'react';
import Header from '@/Components/Common/Header/Header';
import Footer from '@/Components/Common/Footer/Footer';
import { Head, Link, useForm } from '@inertiajs/react';
import { toast } from 'react-toastify';

export default function Contact() {
    // Formulario de Contacto (Simulado)
    const contactForm = useForm({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    // Formulario de Newsletter (Real)
    const newsletterForm = useForm({
        email: '',
        gender: '',
        terms: false,
    });

    const submitContact = (e) => {
        e.preventDefault();
        // Simulación de envío
        toast.success('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
        });
        contactForm.reset();
    };

    const submitNewsletter = (e) => {
        e.preventDefault();

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
            onError: (errors) => {
                toast.error(errors.newsletter || 'Hubo un error al suscribirte.');
            }
        });
    };

    return (
        <div className="min-h-screen bg-bg-main text-text-main font-body">
            <Head title="Contacto - MiKiwi" />
            <Header />

            <main className="container mx-auto px-6 py-12 max-w-6xl">
                <h1 className="text-[32px] font-bold mb-12 font-head uppercase tracking-wider text-secondary-dark">Contacto</h1>

                {/* Contact Form Section */}
                <form onSubmit={submitContact} className="max-w-4xl mb-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                placeholder="Nombre"
                                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary transition-all bg-bg-surface"
                                value={contactForm.data.name}
                                onChange={e => contactForm.setData('name', e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <input
                                type="email"
                                placeholder="Correo electrónico *"
                                required
                                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary transition-all bg-bg-surface"
                                value={contactForm.data.email}
                                onChange={e => contactForm.setData('email', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <input
                            type="tel"
                            placeholder="Número de teléfono"
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary transition-all bg-bg-surface"
                            value={contactForm.data.phone}
                            onChange={e => contactForm.setData('phone', e.target.value)}
                        />
                    </div>

                    <div className="mb-8">
                        <textarea
                            placeholder="Comentario"
                            rows="4"
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary transition-all resize-none bg-bg-surface"
                            value={contactForm.data.message}
                            onChange={e => contactForm.setData('message', e.target.value)}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={contactForm.processing}
                        className="w-full md:w-[220px] py-3 border-2 border-secondary text-secondary-dark rounded-full font-bold hover:bg-secondary hover:text-white transition-all text-sm uppercase tracking-wider"
                    >
                        {contactForm.processing ? 'Enviando...' : 'Enviar'}
                    </button>
                </form>

                {/* Bottom Section: Newsletter & Help */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">

                    {/* Newsletter Card */}
                    <div className="bg-secondary rounded-[15px] p-8 text-text-main relative flex flex-col justify-between shadow-md border border-secondary-dark/20">
                        <div>
                            <h2 className="text-[28px] font-bold mb-6 font-head uppercase tracking-tight">Suscríbete a nuestra Newsletter</h2>
                            <p className="mb-8 text-lg opacity-90 leading-relaxed font-light">
                                Recibe <span className="font-bold">contenido de nuestrxs sexólogxs, novedades y ofertas.</span> ¡Será todo un placer!
                            </p>

                            <div className="mb-8">
                                <p className="mb-4 font-bold">¿Tienes vulva o pene?</p>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${newsletterForm.data.gender === 'vulva' ? 'border-text-main' : 'border-text-main/30 group-hover:border-text-main'}`}>
                                            {newsletterForm.data.gender === 'vulva' && <div className="w-2.5 h-2.5 bg-text-main rounded-full"></div>}
                                        </div>
                                        <input
                                            type="radio"
                                            name="gender"
                                            className="hidden"
                                            onChange={() => newsletterForm.setData('gender', 'vulva')}
                                        />
                                        <span className="font-medium">Vulva</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${newsletterForm.data.gender === 'pene' ? 'border-text-main' : 'border-text-main/30 group-hover:border-text-main'}`}>
                                            {newsletterForm.data.gender === 'pene' && <div className="w-2.5 h-2.5 bg-text-main rounded-full"></div>}
                                        </div>
                                        <input
                                            type="radio"
                                            name="gender"
                                            className="hidden"
                                            onChange={() => newsletterForm.setData('gender', 'pene')}
                                        />
                                        <span className="font-medium">Pene</span>
                                    </label>
                                </div>
                            </div>

                            <div className="mb-6">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    className="w-full bg-bg-surface/50 border-2 border-transparent rounded-lg px-4 py-3 text-text-main placeholder:text-text-main/50 focus:outline-none focus:bg-bg-surface focus:border-secondary-dark transition-all"
                                    value={newsletterForm.data.email}
                                    onChange={e => newsletterForm.setData('email', e.target.value)}
                                />
                            </div>

                            <div className="mb-8">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className={`mt-1 min-w-[18px] h-[18px] border-2 rounded transition-all flex items-center justify-center ${newsletterForm.data.terms ? 'bg-text-main border-text-main' : 'border-text-main/30 group-hover:border-text-main'}`}>
                                        {newsletterForm.data.terms && <span className="text-white text-xs font-bold font-serif">✓</span>}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        onChange={() => newsletterForm.setData('terms', !newsletterForm.data.terms)}
                                    />
                                    <span className="text-sm opacity-90 leading-tight">Acepto la política de privacidad.</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={submitNewsletter}
                                disabled={newsletterForm.processing}
                                className="bg-text-main text-white px-10 py-3 rounded-full font-bold hover:bg-opacity-80 transition-all text-sm mb-6 uppercase tracking-wider disabled:opacity-50"
                            >
                                {newsletterForm.processing ? 'Suscribiendo...' : 'Suscribirme'}
                            </button>
                            <p className="text-[10px] opacity-70 leading-relaxed font-light">
                                Puedes darte de baja cuando quieras. Consulta nuestra política de privacidad <a href="#" className="underline font-normal">aquí</a>.
                            </p>
                        </div>
                    </div>

                    {/* Help Section */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-[24px] font-bold mb-2 font-head">¿Necesitas ayuda?</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between items-start gap-6">
                                <p className="text-text-main font-bold text-sm leading-relaxed max-w-[160px] font-head">
                                    Consulta nuestras preguntas frecuentes
                                </p>
                                <Link
                                    href={route('faq')}
                                    className="w-full py-2.5 border border-secondary text-secondary-dark rounded-full text-center text-xs font-bold hover:bg-secondary hover:text-white transition-all uppercase tracking-widest"
                                >
                                    FAQs
                                </Link>
                            </div>

                            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between items-start gap-6">
                                <p className="text-[#222b24] font-medium text-sm leading-relaxed max-w-[160px]">
                                    Deja un mensaje a nuestro equipo experto
                                </p>
                                <button
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="w-full py-2.5 border border-[#f8b7ea] text-[#d697c8] rounded-full text-center text-xs font-bold hover:bg-[#f8b7ea] hover:text-white transition-all uppercase"
                                >
                                    Hazlo aquí
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 border-t border-gray-100 pt-4 divide-y divide-gray-100">
                            {[
                                { label: 'Tarifas y plazos de envío', href: route('faq') },
                                { label: 'Incidencias o devoluciones', href: route('faq') },
                                { label: 'Contacta con nosotras', href: route('faq') },
                            ].map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.href}
                                    className="flex items-center justify-between py-5 group hover:pl-2 transition-all"
                                >
                                    <span className="text-sm font-bold text-text-main group-hover:text-secondary-dark transition-colors font-head">{link.label}</span>
                                    <span className="text-secondary text-xl transform group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}

