import { Link, usePage } from '@inertiajs/react';
import MikiwiLogo from '@/Components/MikiwiLogo';

export default function Header() {
    const { auth, cartCount } = usePage().props;
    const user = auth?.user;

    return (
        <div className="flex items-center justify-between px-4 md:px-6 bg-black h-[60px] lg:h-[80px] shadow-md transition-all duration-300">
            {/* Left: Logo */}
            <Link href={route('home')} className="flex items-center h-full py-[5px] pl-[5px]">
                <MikiwiLogo
                    className="h-[60%] my-auto w-auto text-white transition-opacity hover:opacity-80"
                />
            </Link>

            {/* Center: Navigation Menu */}
            <nav className="hidden xl:flex items-center gap-8">
                <Link
                    href="/productos?featured=1"
                    className="text-[11px] font-bold text-white uppercase tracking-[0.2em] hover:text-[#99b849] transition-colors"
                >
                    Top Ventas
                </Link>
                <Link
                    href={route('products.index')}
                    className="text-[11px] font-bold text-white uppercase tracking-[0.2em] hover:text-[#99b849] transition-colors"
                >
                    Juguetes
                </Link>
                <Link
                    href="/productos?category=cosmetica-y-cuidado"
                    className="text-[11px] font-bold text-white uppercase tracking-[0.2em] hover:text-[#99b849] transition-colors"
                >
                    Cosmética
                </Link>

                {/* Estimulación Dropdown */}
                <div className="relative group flex items-center h-full cursor-default">
                    <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em] group-hover:text-[#99b849] transition-colors flex items-center gap-1">
                        Estimulación
                        <span className="material-symbols-outlined text-xs translate-y-[1px]">keyboard_arrow_down</span>
                    </span>

                    {/* Dropdown Content */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[120]">
                        <div className="bg-black/95 backdrop-blur-sm border border-white/10 rounded-2xl p-4 min-w-[220px] shadow-2xl">
                            <ul className="flex flex-col gap-3">
                                <li>
                                    <Link
                                        href="/productos?category=estimulacion-interna"
                                        className="text-[10px] font-bold text-white/70 hover:text-[#99b849] uppercase tracking-[0.2em] transition-colors block py-1"
                                    >
                                        Estimulación Interna
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/productos?category=estimulacion-externa"
                                        className="text-[10px] font-bold text-white/70 hover:text-[#99b849] uppercase tracking-[0.2em] transition-colors block py-1"
                                    >
                                        Estimulación Externa
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/productos?category=estimulacion-anal"
                                        className="text-[10px] font-bold text-white/70 hover:text-[#99b849] uppercase tracking-[0.2em] transition-colors block py-1"
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
                    className="text-[11px] font-bold text-[#f8b7ea] uppercase tracking-[0.2em] hover:text-white transition-colors"
                >
                    Muñecas
                </Link>
            </nav>

            {/* Right: Icons (Profile, Cart) */}
            <div className="flex items-center gap-3 md:gap-6">
                <Link href="/perfil" className="hover:opacity-80 transition-opacity flex items-center">
                    <span className="material-symbols-outlined text-white text-2xl lg:text-4xl">person</span>
                </Link>

                {user?.role === 'admin' && (
                    <Link href="/components-manager" className="hover:opacity-80 transition-opacity">
                        <img src="/assets/icons/manager.svg" alt="Manager" className="h-6 w-6 lg:h-8 lg:w-8 invert brightness-0" />
                    </Link>
                )}

                {/* Cart Icon with badge */}
                <Link href={route('cart.index')} className="hover:opacity-80 transition-opacity relative">
                    <img src="/assets/icons/cart.svg" alt="Cart" className="h-6 w-6 lg:h-8 lg:w-8 invert brightness-0" />
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-[#f8b7ea] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full leading-none">
                            {cartCount > 99 ? '99+' : cartCount}
                        </span>
                    )}
                </Link>
            </div>
        </div>
    );
}
