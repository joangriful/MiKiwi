import { Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

export default function Header() {
    const { auth, cartCount } = usePage().props;
    const user = auth?.user;
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchInputRef = useRef(null);
    const searchContainerRef = useRef(null);

    // Close search when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    return (
        <div className="flex items-center justify-between px-4 md:px-6 bg-black h-[60px] lg:h-[80px] shadow-md transition-all duration-300">
            {/* Left: Logo */}
            <Link href={route('home')} className="flex items-center h-full py-[5px] pl-[5px]">
                <img
                    src="/assets/icons/mikiwi_kiwi.svg"
                    alt="MiKiwi Logo"
                    className="h-[60%] my-auto w-auto"
                />
            </Link>

            {/* Right: Icons (Search, Profile, Cart) */}
            <div className="flex items-center gap-3 md:gap-6">

                {/* Expandable Search Bar */}
                <div ref={searchContainerRef} className={`flex items-center relative transition-all duration-300 ease-in-out pl-4 pr-2 py-1 rounded-full border border-transparent ${isSearchOpen ? 'w-48 xs:w-64 bg-white border-primary' : 'w-10 bg-transparent'}`}>
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Buscar..."
                        className={`bg-transparent text-gray-800 text-sm border-none focus:ring-0 outline-none transition-all duration-300 h-full ${isSearchOpen ? 'w-full opacity-100 pr-8' : 'w-0 opacity-0 p-0'}`}
                    />
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="hover:opacity-80 transition-all absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center"
                    >
                        <img
                            src="/assets/icons/search.svg"
                            alt="Search"
                            className={`h-6 w-6 lg:h-8 lg:w-8 transition-all duration-300 ${isSearchOpen ? 'invert-0 brightness-0' : 'invert brightness-0'}`}
                        />
                    </button>
                </div>

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
                        <span className="absolute -top-2 -right-2 bg-[#99b849] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full leading-none">
                            {cartCount > 99 ? '99+' : cartCount}
                        </span>
                    )}
                </Link>

            </div>
        </div>
    );
}
