import React from 'react';
import ConfiguradorLayout from '@/Layouts/ConfiguradorLayout';
import { Head, Link } from '@inertiajs/react';

export default function Home() {
    return (
        <ConfiguradorLayout>
            <Head title="Home" />

            <div className="pt-[15px]">
                {/* IDENTITY CALIBRATION HERO */}
                <section className="px-[5%] py-[120px] pb-[80px] bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-[60px]">
                        <div className="text-left">
                            <span className="text-[0.7rem] uppercase tracking-[2px] font-bold text-[var(--color-primary)] mb-[10px] block">
                                Fase 01
                            </span>
                            <h2 className="font-['Cinzel'] text-[3.5rem] mb-[30px] leading-[1.1] text-[var(--text-main)]">
                                Calibración de Identidad
                            </h2>
                            <p className="text-[1.1rem] text-[var(--text-muted)] mb-[40px] leading-[1.8] font-medium max-w-[500px]">
                                Antes de diseñar tu dispositivo, debemos entender tu resonancia. Nuestro algoritmo de identidad
                                analizará tus preferencias sensoriales para crear un perfil único.
                            </p>
                            <Link href="/configurador/quiz" className="btn-minimal btn-primary px-[45px] py-[18px] text-[1.1rem]">
                                Comenzar Secuencia
                            </Link>
                        </div>
                        <div className="h-[400px] bg-[var(--bg-main)] rounded-[var(--radius-lg)] flex items-center justify-center relative overflow-hidden border border-[var(--border)]">
                            <div className="w-[150px] h-[150px] border-2 border-[var(--color-primary)] rounded-full animate-pulse-ring absolute"></div>
                            <div className="w-[100px] h-[100px] bg-[var(--color-primary)] rounded-full opacity-10 absolute"></div>
                            <div className="font-['Cinzel'] text-[1.5rem] tracking-[5px] text-[var(--text-main)] relative z-[2]">
                                AURA ID
                            </div>
                        </div>
                    </div>
                </section>

                {/* HERO SECTION */}
                <section className="px-[5%] py-[80px] text-center bg-[radial-gradient(circle_at_50%_50%,#ffffff_0%,var(--bg-main)_100%)] relative overflow-hidden">
                    <div className="absolute top-[-10%] left-1/2 w-[80%] h-[120%] bg-[radial-gradient(circle,rgba(153,184,73,0.05)_0%,transparent_60%)] translate-x-[-50%] z-0 pointer-events-none"></div>

                    <div className="relative z-10">
                        <h1 className="font-['Cinzel'] text-[4rem] mb-[20px] tracking-[-2px] text-[var(--text-main)] leading-[1.1] uppercase">
                            ECLIPSE
                        </h1>
                        <p className="text-[1.1rem] text-[var(--text-muted)] max-w-[600px] mx-auto mb-[50px] font-medium">
                            Bienvenido al futuro del bienestar sensorial. Redefiniendo los límites entre el objeto y la sensación.
                        </p>

                        <div className="max-w-[700px] mx-auto relative">
                            <span className="absolute left-[25px] top-1/2 translate-y-[-50%] text-[1.4rem] text-[var(--text-muted)]">🔍</span>
                            <input
                                type="text"
                                className="w-full px-[35px] pl-[65px] py-[22px] rounded-[60px] border border-[var(--border)] bg-[var(--bg-surface)] text-[1.1rem] text-[var(--text-main)] shadow-[var(--shadow-soft)] focus:border-[var(--color-primary)] focus:shadow-[var(--shadow-medium)] outline-none transition-all"
                                placeholder="¿Qué sensación buscas hoy?"
                            />
                            <div className="mt-[25px] flex justify-center gap-[12px] flex-wrap">
                                {['Visual', 'Táctil', 'Rítmico', 'Profundo'].map(tag => (
                                    <span key={tag} className="px-[20px] py-[8px] bg-white/50 border border-[var(--border)] rounded-[30px] text-[0.8rem] font-semibold text-[var(--text-muted)] cursor-pointer hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-white transition-all">
                                        ✦ {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* COLLECTIONS GRID */}
                <section className="px-[5%] py-[100px]">
                    <div className="text-center mb-[60px]">
                        <h2 className="font-['Cinzel'] text-[2.5rem] mb-[15px] text-[var(--text-main)]">Colecciones</h2>
                        <p className="text-[var(--text-muted)] font-medium">Diseños exclusivos para cada estado mental.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px]">
                        <Link href="/configurador/collections" className="h-[450px] relative rounded-[var(--radius-md)] overflow-hidden flex items-end p-[40px] group transition-all hover:translate-y-[-10px] hover:shadow-[var(--shadow-medium)] bg-[#222]">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-[1]"></div>
                            <div className="relative z-[2]">
                                <span className="text-[0.7rem] uppercase tracking-[2px] font-bold text-[var(--color-primary)] mb-[10px] block">Novedad</span>
                                <h3 className="text-[1.8rem] font-bold text-white mb-[10px]">Shadow Series</h3>
                                <p className="text-white/70">Misterio en cada detalle.</p>
                            </div>
                        </Link>

                        <Link href="/configurador/collections" className="h-[450px] relative rounded-[var(--radius-md)] overflow-hidden flex items-end p-[40px] group transition-all hover:translate-y-[-10px] hover:shadow-[var(--shadow-medium)] bg-[var(--bg-surface)] border border-[var(--border)]">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-[1]"></div>
                            <div className="relative z-[2]">
                                <span className="text-[0.7rem] uppercase tracking-[2px] font-bold text-[var(--color-primary)] mb-[10px] block">Elegancia</span>
                                <h3 className="text-[1.8rem] font-bold text-[var(--text-main)] mb-[10px]">Pearl Edition</h3>
                                <p className="text-[var(--text-muted)]">Pureza y suavidad infinita.</p>
                            </div>
                        </Link>

                        <Link href="/configurador/collections" className="h-[450px] relative rounded-[var(--radius-md)] overflow-hidden flex items-end p-[40px] group transition-all hover:translate-y-[-10px] hover:shadow-[var(--shadow-medium)] bg-white border border-[var(--border)]">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-[1]"></div>
                            <div className="relative z-[2]">
                                <span className="text-[0.7rem] uppercase tracking-[2px] font-bold text-[var(--color-primary)] mb-[10px] block">Premium</span>
                                <h3 className="text-[1.8rem] font-bold text-[var(--text-main)] mb-[10px]">The Signature</h3>
                                <p className="text-[var(--text-muted)]">Nuestro modelo más avanzado.</p>
                            </div>
                        </Link>
                    </div>
                </section>

                {/* BRAND STORY */}
                <section className="px-[5%] py-[100px] bg-[var(--bg-surface)] grid grid-cols-1 md:grid-cols-2 items-center gap-[80px]">
                    <div className="h-[600px] bg-[#f8f5f0] rounded-[var(--radius-lg)] relative flex items-center justify-center overflow-hidden">
                        <div className="w-[200px] h-[400px] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-[100px] blur-[20px] opacity-15 animate-slow-float"></div>
                        <div className="font-['Cinzel'] text-[8rem] opacity-5 absolute">KIWI</div>
                    </div>
                    <div>
                        <h2 className="font-['Cinzel'] text-[3.5rem] mb-[30px] leading-[1.1]">El Arte de la Resonancia</h2>
                        <p className="text-[1.1rem] text-[var(--text-muted)] mb-[40px] leading-[1.8]">
                            En MI KIWI no creamos objetos, diseñamos puentes. Puentes entre tu cuerpo y tus deseos más profundos.
                            Cada dispositivo Eclipse es una obra maestra de ingeniería ergonómica y estética minimalista.
                        </p>
                        <a href="#" className="btn-minimal btn-outline">Nuestra Filosofía</a>
                    </div>
                </section>

                {/* CTA CALIBRATION */}
                <section className="px-[5%] py-[80px]">
                    <div className="p-[80px] bg-[var(--color-primary)] rounded-[var(--radius-lg)] text-center text-white relative overflow-hidden">
                        <h2 className="font-['Cinzel'] text-[3rem] mb-[20px]">Calibración Sensorial</h2>
                        <p className="text-[1.2rem] mb-[40px] opacity-90">No elijas tú el producto. Deja que tus sentidos nos guíen hacia él.</p>
                        <Link href="/configurador/quiz" className="btn-minimal bg-white text-[var(--color-primary)] px-[45px] py-[18px] text-[1.1rem] hover:bg-opacity-90">
                            Comenzar Test de Vibración
                        </Link>
                    </div>
                </section>
            </div>
        </ConfiguradorLayout>
    );
}
