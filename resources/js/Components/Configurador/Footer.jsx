import React from 'react';

export default function Footer() {
    return (
        <footer className="px-[5%] py-[100px] pb-[50px] bg-white border-t border-[var(--border)]">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1.5fr] gap-[60px] mb-[80px]">
                <div>
                    <div className="configurador-logo text-[1.8rem] font-extrabold tracking-[4px] mb-[25px]">MI KIWI</div>
                    <p className="text-[var(--text-muted)] lg:leading-[1.6]">
                        Liderando la revolución del bienestar sensorial con tecnología propia y diseño suizo.
                    </p>
                </div>
                <div>
                    <h4 className="uppercase text-[0.8rem] tracking-[2px] mb-[25px] text-[var(--text-main)] font-semibold">Explorar</h4>
                    <ul className="list-none">
                        <li className="mb-[15px]"><a href="#" className="text-[var(--text-muted)] text-[0.9rem] font-medium hover:text-[var(--color-primary)]">Colecciones</a></li>
                        <li className="mb-[15px]"><a href="#" className="text-[var(--text-muted)] text-[0.9rem] font-medium hover:text-[var(--color-primary)]">Configurador</a></li>
                        <li className="mb-[15px]"><a href="#" className="text-[var(--text-muted)] text-[0.9rem] font-medium hover:text-[var(--color-primary)]">Puntos de venta</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="uppercase text-[0.8rem] tracking-[2px] mb-[25px] text-[var(--text-main)] font-semibold">Soporte</h4>
                    <ul className="list-none">
                        <li className="mb-[15px]"><a href="#" className="text-[var(--text-muted)] text-[0.9rem] font-medium hover:text-[var(--color-primary)]">FAQ</a></li>
                        <li className="mb-[15px]"><a href="#" className="text-[var(--text-muted)] text-[0.9rem] font-medium hover:text-[var(--color-primary)]">Envíos</a></li>
                        <li className="mb-[15px]"><a href="#" className="text-[var(--text-muted)] text-[0.9rem] font-medium hover:text-[var(--color-primary)]">Garantía</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="uppercase text-[0.8rem] tracking-[2px] mb-[25px] text-[var(--text-main)] font-semibold">Newsletter</h4>
                    <p className="text-[0.85rem] text-[var(--text-muted)] mb-[20px]">Únete a la élite sensorial.</p>
                    <div className="flex gap-[10px]">
                        <input
                            type="email"
                            placeholder="Email"
                            className="px-[20px] py-[12px] rounded-[30px] border border-[var(--border)] flex-1 outline-none text-[0.9rem]"
                        />
                        <button className="btn-minimal btn-primary px-[20px]">
                            &rarr;
                        </button>
                    </div>
                </div>
            </div>
            <div className="pt-[40px] border-t border-[var(--border)] text-center text-[0.8rem] text-[var(--text-muted)] tracking-[1px] uppercase">
                &copy; {new Date().getFullYear()} MI KIWI PROJECT • BEYOND THE PHYSICAL
            </div>
        </footer>
    );
}
