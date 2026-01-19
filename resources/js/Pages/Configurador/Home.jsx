import React from 'react';
import ConfiguradorLayout from '@/Layouts/ConfiguradorLayout';
import { Head, Link } from '@inertiajs/react';

export default function Home() {
    return (
        <ConfiguradorLayout>
            <Head title="Home | Configurator" />

            {/* --- HERO: ECLIPSE --- */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial-gradient from-[rgba(153,184,73,0.05)] to-transparent rounded-full animate-slow-float opacity-30"></div>
                </div>

                <div className="relative z-10 text-center px-[5%]">
                    <span className="block text-[0.7rem] uppercase tracking-[8px] font-black text-[var(--text-muted)] mb-[30px] animate-fade-in-slide">
                        Próxima Generación
                    </span>
                    <h1 className="text-[10vw] md:text-[8vw] font-['Cinzel'] font-black leading-none mb-[40px] tracking-[-0.05em] text-[var(--text-main)] animate-fade-in-slide">
                        ECLIPSE
                    </h1>
                    <p className="max-w-[600px] mx-auto text-[1.1rem] md:text-[1.4rem] text-[var(--text-muted)] font-medium leading-relaxed mb-[60px] animate-fade-in-slide">
                        Donde la tecnología de precisión se encuentra con la profundidad sensorial.
                    </p>

                    <div className="flex flex-col md:flex-row gap-[20px] justify-center items-center animate-fade-in-slide">
                        <Link
                            href="/configurador/wizard"
                            className="px-[40px] py-[20px] bg-[var(--text-main)] text-white text-[0.75rem] font-black tracking-[4px] uppercase hover:bg-[var(--color-primary)] transition-all"
                        >
                            Configuración Personal
                        </Link>
                        <Link
                            href="/configurador/collections"
                            className="px-[40px] py-[20px] border border-[var(--border)] text-[var(--text-main)] text-[0.75rem] font-black tracking-[4px] uppercase hover:bg-[var(--bg-main)] transition-all"
                        >
                            Explorar Archivo
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-[50px] left-1/2 -translate-x-1/2 text-[0.6rem] uppercase tracking-[4px] font-black text-[var(--border)] animate-pulse">
                    Deslizar para descubrir
                </div>
            </section>

            {/* --- IDENTITY CALIBRATION --- */}
            <section className="px-[5%] py-[150px] bg-[#fdfdfd] border-y border-[var(--border)]">
                <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-[100px] items-center">
                    <div>
                        <h2 className="font-['Cinzel'] text-[3rem] md:text-[4.5rem] leading-[1.1] mb-[40px] font-black text-[var(--text-main)]">
                            Identidad Sónica.
                        </h2>
                        <p className="text-[1.1rem] text-[var(--text-muted)] leading-[1.8] mb-[50px]">
                            Cada individuo posee una huella de resonancia única. Nuestro sistema de calibración utiliza algoritmos avanzados para materializar tu perfil sensorial en una pieza única de ingeniería.
                        </p>
                        <Link
                            href="/configurador/quiz"
                            className="inline-block text-[0.75rem] font-black uppercase tracking-[4px] border-b-2 border-[var(--color-primary)] pb-2 hover:border-[var(--text-main)] transition-all"
                        >
                            Iniciar Calibración AURA ID
                        </Link>
                    </div>
                    <div className="relative aspect-square flex items-center justify-center">
                        <div className="absolute inset-0 border border-[var(--border)] rounded-full animate-pulse-ring"></div>
                        <div className="absolute inset-[15%] border border-[var(--border)] rounded-full animate-pulse-ring" style={{ animationDelay: '1s' }}></div>
                        <div className="w-[40%] h-[40%] bg-white border border-[var(--border)] rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.05)] flex items-center justify-center z-10">
                            <span className="text-[0.6rem] font-black tracking-[4px] text-[var(--text-main)] uppercase">Resonancia</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- COLLECTIONS GRID --- */}
            <section className="px-[5%] py-[180px]">
                <div className="flex flex-col md:flex-row justify-between items-end mb-[100px] gap-[30px]">
                    <div className="max-w-[500px]">
                        <span className="text-[0.7rem] uppercase tracking-[4px] font-black text-[var(--color-primary)] mb-[20px] block">Curaduría</span>
                        <h2 className="font-['Cinzel'] text-[3.5rem] leading-none mb-[20px] font-black">Colecciones.</h2>
                    </div>
                    <div className="text-[0.75rem] font-black uppercase tracking-[2px] text-[var(--text-muted)] pb-1 border-b border-[var(--border)] cursor-pointer hover:border-[var(--text-main)] transition-all">
                        Ver todas
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px] bg-[var(--border)] border border-[var(--border)] overflow-hidden">
                    {[
                        { title: "Shadow Series", desc: "La profundidad del negro absoluto.", price: "89", type: "Experimental" },
                        { title: "Pearl Edition", desc: "Luminosidad y calma orgánica.", price: "99", type: "Edición Limitada" },
                        { title: "The Signature", desc: "La cúspide del diseño funcional.", price: "129", type: "Atelier" }
                    ].map((item, idx) => (
                        <div key={idx} className="group bg-white p-[60px] flex flex-col justify-between aspect-[4/5] hover:bg-[#fafafa] transition-colors relative">
                            <div>
                                <span className="text-[0.6rem] uppercase tracking-[3px] font-bold text-[var(--text-muted)] mb-[10px] block">{item.type}</span>
                                <h3 className="text-[1.8rem] font-['Cinzel'] font-black mb-[20px]">{item.title}</h3>
                                <p className="text-[0.9rem] text-[var(--text-muted)] leading-relaxed max-w-[200px]">
                                    {item.desc}
                                </p>
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="text-[1.2rem] font-black uppercase">
                                    <span className="text-[0.7rem] text-[var(--text-muted)] align-top font-bold mr-1">EUR</span>
                                    {item.price}
                                </div>
                                <Link
                                    href="/configurador/wizard"
                                    className="text-[0.65rem] font-black uppercase tracking-[3px] opacity-0 group-hover:opacity-100 transition-opacity translate-y-[10px] group-hover:translate-y-0 transition-transform"
                                >
                                    Personalizar
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- CALIBRACIÓN SENSORIAL CTA --- */}
            <section className="px-[5%] py-[200px] bg-[var(--text-main)] text-white text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none text-[30vw] font-black leading-none flex items-center justify-center select-none font-['Cinzel']">
                    KIWI
                </div>
                <div className="relative z-10 max-w-[800px] mx-auto">
                    <h2 className="font-['Cinzel'] text-[3.5rem] md:text-[5rem] font-black leading-[1] mb-[50px]">
                        Redefine tu Percepción.
                    </h2>
                    <p className="text-[1.2rem] md:text-[1.5rem] font-medium text-white/70 mb-[70px] leading-relaxed italic">
                        "La verdadera tecnología no se siente en las manos, se siente en el alma."
                    </p>
                    <Link
                        href="/configurador/quiz"
                        className="inline-block px-[60px] py-[25px] border-2 border-white text-white text-[0.8rem] font-black tracking-[6px] uppercase hover:bg-white hover:text-[var(--text-main)] transition-all"
                    >
                        Iniciar Test de Identidad
                    </Link>
                </div>
            </section>
        </ConfiguradorLayout>
    );
}
