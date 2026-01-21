export default function Header() {
    return (
        <div className="flex items-center justify-between px-6 bg-black h-20 shadow-md">
            {/* Left: Logo */}
            <div className="flex items-center">
                <img
                    src="/assets/icons/mikiwi_logo.svg"
                    alt="MiKiwi Logo"
                    className="h-8 w-auto invert brightness-0"
                />
            </div>

            {/* Right: Icons (Search, Profile, Cart) */}
            <div className="flex items-center gap-6">
                <button className="hover:opacity-80 transition-opacity">
                    <img src="/assets/icons/search.svg" alt="Search" className="h-6 w-6 invert brightness-0" />
                </button>

                <button className="hover:opacity-80 transition-opacity">
                    <span className="material-symbols-outlined text-white text-2xl">person</span>
                </button>

                <button className="hover:opacity-80 transition-opacity relative">
                    <img src="/assets/icons/cart.svg" alt="Cart" className="h-6 w-6 invert brightness-0" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1 rounded-full min-w-[14px] flex items-center justify-center">
                        2
                    </span>
                </button>
            </div>
        </div>
    );
}
