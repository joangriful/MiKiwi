import React from 'react';
import { Link } from '@inertiajs/react';

export default function Header() {
    return (
        <header className="fixed top-0 w-full px-[5%] py-[20px] flex justify-between items-center z-[1000] bg-white/90 backdrop-blur-[20px] border-b border-[var(--border)]">
            <div className="configurador-logo text-[1.2rem] font-black tracking-[6px] text-[var(--text-main)] transition-opacity hover:opacity-70 cursor-default">
                MI<span>.</span>KIWI
            </div>
            <nav className="hidden md:block">
                <ul className="flex gap-[40px] list-none">
                    <li>
                        <Link href="/configurador/collections" className="text-[0.75rem] uppercase tracking-[2px] font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                            Colecciones
                        </Link>
                    </li>
                    <li>
                        <Link href="/configurador/wizard" className="text-[0.75rem] uppercase tracking-[2px] font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                            Configurador
                        </Link>
                    </li>
                    <li>
                        <Link href="/calibracion" className="text-[0.75rem] uppercase tracking-[2px] font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                            Resonancia
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="flex gap-[30px] items-center">
                <span className="text-[0.7rem] uppercase tracking-[2px] font-bold text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-main)] transition-all">Buscar</span>
                <Link href="/configurador/wizard" className="text-[0.7rem] uppercase tracking-[2px] font-bold text-[var(--text-main)] border-b-2 border-[var(--color-primary)] pb-1 transition-all hover:border-[var(--text-main)]">
                    Empezar
                </Link>
            </div>
        </header>
    );
}
