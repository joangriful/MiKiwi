import React from 'react';

export default function Footer() {
    return (
        <footer className="px-[5%] py-[120px] pb-[60px] bg-[#fafafa] border-t border-[var(--border)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[80px] mb-[100px]">
                <div className="col-span-1 lg:col-span-1">
                    <div className="configurador-logo text-[1.5rem] font-black tracking-[8px] mb-[30px] text-[var(--text-main)]">MI KIWI</div>
                    <p className="text-[var(--text-muted)] text-[0.85rem] leading-[2] max-w-[280px]">
                        Reduccionismo técnico y excelencia sensorial. Diseñado para la introspección moderna.
                    </p>
                </div>
                <div>
                    <h4 className="uppercase text-[0.7rem] tracking-[3px] mb-[35px] text-[var(--text-main)] font-black">Navegación</h4>
                    <ul className="list-none space-y-[15px]">
                        <li><a href="#" className="text-[var(--text-muted)] text-[0.8rem] font-bold tracking-[1px] hover:text-[var(--color-primary)] transition-colors">Colecciones</a></li>
                        <li><a href="#" className="text-[var(--text-muted)] text-[0.8rem] font-bold tracking-[1px] hover:text-[var(--color-primary)] transition-colors">Configurador</a></li>
                        <li><a href="#" className="text-[var(--text-muted)] text-[0.8rem] font-bold tracking-[1px] hover:text-[var(--color-primary)] transition-colors">Atelier</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="uppercase text-[0.7rem] tracking-[3px] mb-[35px] text-[var(--text-main)] font-black">Soporte</h4>
                    <ul className="list-none space-y-[15px]">
                        <li><a href="#" className="text-[var(--text-muted)] text-[0.8rem] font-bold tracking-[1px] hover:text-[var(--color-primary)] transition-colors">FAQ</a></li>
                        <li><a href="#" className="text-[var(--text-muted)] text-[0.8rem] font-bold tracking-[1px] hover:text-[var(--color-primary)] transition-colors">Envíos</a></li>
                        <li><a href="#" className="text-[var(--text-muted)] text-[0.8rem] font-bold tracking-[1px] hover:text-[var(--color-primary)] transition-colors">Manifiesto</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="uppercase text-[0.7rem] tracking-[3px] mb-[35px] text-[var(--text-main)] font-black">Boletín</h4>
                    <p className="text-[0.75rem] text-[var(--text-muted)] mb-[25px] font-medium leading-relaxed">Únete al círculo exclusivo de MiKiwi.</p>
                    <div className="flex flex-col gap-[15px]">
                        <input
                            type="email"
                            placeholder="DIRECCIÓN EMAIL"
                            className="px-[0px] py-[12px] bg-transparent border-b border-[var(--border)] outline-none text-[0.7rem] tracking-[2px] font-bold focus:border-[var(--text-main)] transition-all placeholder:text-[var(--border)]"
                        />
                        <button className="text-[0.7rem] uppercase tracking-[3px] font-black text-left hover:text-[var(--color-primary)] transition-colors">
                            SUSCRIBIRSE
                        </button>
                    </div>
                </div>
            </div>
            <div className="pt-[60px] border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-[20px] text-[0.65rem] text-[var(--text-muted)] tracking-[2px] font-bold uppercase">
                <div>&copy; {new Date().getFullYear()} MI KIWI • SWISS DESIGN ORIGIN</div>
                <div className="flex gap-[30px]">
                    <a href="#" className="hover:text-[var(--text-main)]">Privacidad</a>
                    <a href="#" className="hover:text-[var(--text-main)]">Términos</a>
                    <a href="#" className="hover:text-[var(--text-main)]">Legal</a>
                </div>
            </div>
        </footer>
    );
}
