import { Link, usePage } from '@inertiajs/react';
import MikiwiLogo from '@/Components/MikiwiLogo/MikiwiLogo';
import styles from './Header.module.css';

export default function Header() {
    const { auth, cartCount } = usePage().props;
    const user = auth?.user;

    return (
        <div className={`${styles.root} flex items-center justify-between px-4 md:px-8 bg-black h-[70px] lg:h-[90px] shadow-md transition-all duration-300`}>
            {/* Left: Logo */}
            <Link href={route('home')} className="flex items-center h-full py-[8px] pl-[5px]">
                <MikiwiLogo
                    className="h-[70%] my-auto w-auto text-white transition-opacity hover:opacity-80"
                />
            </Link>

            {/* Center: Navigation Menu (Hidden on small mobile, but larger text for tablet/desktop) */}
            <nav className="hidden xl:flex items-center gap-10">
                <Link
                    href="/productos?featured=1"
                    className="text-[13px] font-bold text-white uppercase tracking-[0.2em] hover:text-[#99b849] transition-colors"
                >
                    Top Ventas
                </Link>
                <Link
                    href={route('products.index')}
                    className="text-[13px] font-bold text-white uppercase tracking-[0.2em] hover:text-[#99b849] transition-colors"
                >
                    Juguetes
                </Link>
                <Link
                    href="/productos?category=cosmetica-y-cuidado"
                    className="text-[13px] font-bold text-white uppercase tracking-[0.2em] hover:text-[#99b849] transition-colors"
                >
                    Cosmética
                </Link>

                {/* Estimulación Dropdown */}
                <div className="relative group flex items-center h-full cursor-default">
                    <span className="text-[13px] font-bold text-white uppercase tracking-[0.2em] group-hover:text-[#99b849] transition-colors flex items-center gap-1">
                        Estimulación
                        <svg
                            className="h-3 w-3 translate-y-[1px]"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </span>

                    {/* Dropdown Content */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[120]">
                        <div className="bg-black/95 backdrop-blur-sm border border-white/10 rounded-2xl p-5 min-w-[240px] shadow-2xl">
                            <ul className="flex flex-col gap-4">
                                <li>
                                    <Link
                                        href="/productos?category=estimulacion-interna"
                                        className="text-[11px] font-bold text-white/70 hover:text-[#99b849] uppercase tracking-[0.2em] transition-colors block py-1"
                                    >
                                        Estimulación Interna
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/productos?category=estimulacion-externa"
                                        className="text-[11px] font-bold text-white/70 hover:text-[#99b849] uppercase tracking-[0.2em] transition-colors block py-1"
                                    >
                                        Estimulación Externa
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/productos?category=estimulacion-anal"
                                        className="text-[11px] font-bold text-white/70 hover:text-[#99b849] uppercase tracking-[0.2em] transition-colors block py-1"
                                    >
                                        Estimulación Anal
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <Link
                    href={route('doll.config.test')}
                    className="text-[13px] font-bold text-[#f8b7ea] uppercase tracking-[0.2em] hover:text-white transition-colors"
                >
                    Muñecas
                </Link>
            </nav>

            {/* Right: Icons (Profile, Cart) */}
            <div className="flex items-center gap-5 md:gap-8">
                <Link href="/perfil" className="hover:opacity-80 transition-opacity flex items-center">
                    <img
                        src="/assets/icons/perfil.svg"
                        alt="Perfil"
                        className="h-7 w-7 lg:h-9 lg:w-9"
                    />
                </Link>

                {user?.role === 'admin' && (
                    <Link href="/components-manager" className="hover:opacity-80 transition-opacity">
                        <img src="/assets/icons/manager.svg" alt="Manager" className="h-7 w-7 lg:h-9 lg:w-9 invert brightness-0" />
                    </Link>
                )}

                {/* Cart Icon with badge */}
                <Link href={route('cart.index')} className="hover:opacity-80 transition-opacity relative">
                    <img src="/assets/icons/cart.svg" alt="Cart" className="h-7 w-7 lg:h-9 lg:w-9 invert brightness-0" />
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-[#f8b7ea] text-white text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-full leading-none">
                            {cartCount > 99 ? '99+' : cartCount}
                        </span>
                    )}
                </Link>
            </div>
        </div>
    );
}
