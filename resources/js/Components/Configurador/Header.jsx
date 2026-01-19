import React from 'react';
import { Link } from '@inertiajs/react';

export default function Header() {
    return (
        <header className="fixed top-0 w-full px-[5%] py-[15px] flex justify-between items-center z-[1000] bg-white/85 backdrop-blur-[15px] border-b border-[var(--border)]">
            <div className="configurador-logo text-[1.4rem] font-extrabold tracking-[4px] text-[var(--text-main)]">
                MI<span>.</span>KIWI
            </div>
            <nav>
                <ul className="flex gap-[30px] list-none">
                    <li>
                        <Link href="/configurador/collections" className="text-[0.85rem] uppercase tracking-[1px] font-semibold text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-all">
                            Colecciones
                        </Link>
                    </li>
                    <li>
                        <Link href="/configurador/wizard" className="text-[0.85rem] uppercase tracking-[1px] font-semibold text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-all">
                            Personalizar
                        </Link>
                    </li>
                    <li>
                        <Link href="/calibracion" className="text-[0.85rem] uppercase tracking-[1px] font-semibold text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-all">
                            Calibración
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="flex gap-[20px] items-center">
                <div className="text-[1.2rem] cursor-pointer text-[var(--text-main)] hover:text-[var(--color-primary)] transition-all">🔍</div>
                <div className="text-[1.2rem] cursor-pointer text-[var(--text-main)] hover:text-[var(--color-primary)] transition-all">🛒</div>
                <Link href="/configurador/wizard" className="btn-minimal btn-primary px-[22px] py-[10px]">
                    Diseñar
                </Link>
            </div>
        </header>
    );
}
