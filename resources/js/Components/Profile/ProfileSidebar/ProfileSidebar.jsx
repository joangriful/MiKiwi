import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import styles from "./ProfileSidebar.module.css";

export default function ProfileSidebar({ activeTab, setActiveTab }) {
    const menuItems = [
        { id: "profile", label: "Perfil", icon: "person", isMaterial: true },
        { id: "addresses", label: "Direcciones", icon: "location_on", isMaterial: true },
        { id: "orders", label: "Historial de pedidos", icon: "pedidos.svg" },
        {
            id: "edit-account",
            label: "Editar Detalles de la cuenta",
            icon: "account_preferences.svg",
        },
        {
            id: "cards",
            label: "Tarjetas",
            icon: "credit_card",
            isMaterial: true,
        }, // Added Cards
        {
            id: "preferences",
            label: "Gestiona tus preferencias",
            icon: "preferences.svg",
        },
        { id: "returns", label: "Devoluciones", icon: "refund.svg" },
    ];

    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const activeItem = menuItems.find((item) => item.id === activeTab) || menuItems[0];

    const handleTabChange = (id) => {
        setActiveTab(id);
        setIsMobileOpen(false);
    };

    return (
        <aside className={`${styles.root} w-full lg:w-64 bg-white border-b lg:border-r border-gray-100 flex-shrink-0 relative`}>
            <nav className="flex flex-col p-4 h-full">
                {/* Mobile Trigger */}
                <div className="lg:hidden mb-1">
                    <button
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all duration-200"
                    >
                        <div className="flex items-center">
                            {activeItem.icon && !activeItem.isMaterial && (
                                <span
                                    className="w-5 h-5 mr-3 bg-[#99b849] flex-shrink-0"
                                    style={{
                                        maskImage: `url('/assets/icons/${activeItem.icon}')`,
                                        maskSize: "contain",
                                        maskRepeat: "no-repeat",
                                        maskPosition: "center",
                                        WebkitMaskImage: `url('/assets/icons/${activeItem.icon}')`,
                                        WebkitMaskSize: "contain",
                                        WebkitMaskRepeat: "no-repeat",
                                        WebkitMaskPosition: "center",
                                    }}
                                ></span>
                            )}
                            {activeItem.icon && activeItem.isMaterial && (
                                <span className="material-symbols-outlined w-5 h-5 mr-3 text-[#99b849] text-xl leading-none">
                                    {activeItem.icon}
                                </span>
                            )}
                            <span className="font-medium text-gray-900">{activeItem.label}</span>
                        </div>
                        <span className={`material-symbols-outlined transition-transform duration-200 ${isMobileOpen ? 'rotate-180' : ''}`}>
                            expand_more
                        </span>
                    </button>
                </div>

                {/* Navigation Items - Hidden on mobile unless open */}
                <div className={`flex-1 space-y-1 mt-1 ${isMobileOpen ? 'block' : 'hidden lg:block'}`}>
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleTabChange(item.id)}
                            className={`group flex items-center w-full text-left px-4 py-3 text-sm rounded-lg transition-all duration-200 font-medium ${activeTab === item.id
                                    ? "bg-[#99b849]/10 text-[#99b849] border-l-4 border-[#99b849]"
                                    : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                                }`}
                        >
                            {item.icon && !item.isMaterial && (
                                <span
                                    className={`w-5 h-5 mr-5 flex-shrink-0 transition-colors duration-200 ${activeTab === item.id
                                            ? "bg-[#99b849]"
                                            : "bg-gray-400 group-hover:bg-pink-500"
                                        }`}
                                    style={{
                                        maskImage: `url('/assets/icons/${item.icon}')`,
                                        maskSize: "contain",
                                        maskRepeat: "no-repeat",
                                        maskPosition: "center",
                                        WebkitMaskImage: `url('/assets/icons/${item.icon}')`,
                                        WebkitMaskSize: "contain",
                                        WebkitMaskRepeat: "no-repeat",
                                        WebkitMaskPosition: "center",
                                    }}
                                ></span>
                            )}
                            {item.icon && item.isMaterial && (
                                <span
                                    className={`material-symbols-outlined w-5 h-5 mr-5 flex-shrink-0 text-xl leading-none transition-colors duration-200 ${activeTab === item.id
                                            ? "text-[#99b849]"
                                            : "text-gray-400 group-hover:text-pink-500"
                                        }`}
                                >
                                    {item.icon}
                                </span>
                            )}
                            {!item.icon && (
                                <span className="w-5 h-5 mr-5"></span>
                            )}
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className={`pt-4 mt-4 border-t border-gray-100 ${isMobileOpen ? 'block' : 'hidden lg:block'}`}>
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
                    >
                        <span className="material-symbols-outlined w-5 h-5 mr-5 text-xl leading-none">
                            logout
                        </span>
                        Cerrar Sesión
                    </Link>
                </div>
            </nav>
        </aside>
    );
}
