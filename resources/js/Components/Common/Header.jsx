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
                    href={route('products.index')}
                    className="text-[11px] font-bold text-white uppercase tracking-[0.2em] hover:text-[#f8b7ea] transition-colors"
                >
                    Top Ventas
                </Link>
                <Link
                    href="/productos?category=bdsm-y-fetiche"
                    className="text-[11px] font-bold text-white uppercase tracking-[0.2em] hover:text-[#f8b7ea] transition-colors"
                >
                    BDSM
                </Link>
                <Link
                    href="/productos?category=cosmetica-y-cuidado"
                    className="text-[11px] font-bold text-white uppercase tracking-[0.2em] hover:text-[#f8b7ea] transition-colors"
                >
                    Cosmética
                </Link>
                <Link
                    href="/productos?category=estimulacion-anal"
                    className="text-[11px] font-bold text-white uppercase tracking-[0.2em] hover:text-[#f8b7ea] transition-colors"
                >
                    Estimulación Anal
                </Link>
                <Link
                    href="/productos?category=estimulacion-externa"
                    className="text-[11px] font-bold text-white uppercase tracking-[0.2em] hover:text-[#f8b7ea] transition-colors"
                >
                    Estimulación Externa
                </Link>
                <Link
                    href="/productos?category=estimulacion-interna"
                    className="text-[11px] font-bold text-white uppercase tracking-[0.2em] hover:text-[#f8b7ea] transition-colors"
                >
                    Estimulación Interna
                </Link>
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
