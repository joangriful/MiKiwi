import React from 'react';
import { Link } from '@inertiajs/react';

export default function ProfileSidebar({ activeTab, setActiveTab }) {
    const menuItems = [
        { id: 'profile', label: 'Perfil', icon: 'person', isMaterial: true },
        { id: 'likes', label: 'Gustados', icon: 'MdiCardsHeart.svg' },
        { id: 'level', label: 'Nivel', icon: 'level.svg' },
        { id: 'orders', label: 'Historial de pedidos', icon: 'pedidos.svg' },
        { id: 'edit-account', label: 'Editar Detalles de la cuenta', icon: 'account_preferences.svg' },
        { id: 'cards', label: 'Tarjetas', icon: 'credit_card', isMaterial: true }, // Added Cards
        { id: 'preferences', label: 'Gestiona tus preferencias', icon: 'preferences.svg' },
        { id: 'return-item', label: 'Devolver Articulo' },
        { id: 'returns', label: 'Devoluciones', icon: 'refund.svg' },
        { id: 'addresses', label: 'Direcciones', icon: 'address.svg' },
        { id: 'newsletters', label: 'Newsletters', icon: 'newsletter.svg' },
    ];


    return (
        <aside className="w-full lg:w-64 bg-white border-r border-gray-100 flex-shrink-0">
            <nav className="flex flex-col space-y-1 p-4 h-full">
                <div className="flex-1 space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`group flex items-center w-full text-left px-4 py-3 text-sm rounded-lg transition-all duration-200 font-medium ${activeTab === item.id
                                ? 'bg-[#99b849]/10 text-[#99b849] border-l-4 border-[#99b849]'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            {item.icon && !item.isMaterial && (
                                <span
                                    className={`w-5 h-5 mr-5 flex-shrink-0 transition-colors duration-200 ${activeTab === item.id ? 'bg-[#99b849]' : 'bg-gray-400 group-hover:bg-gray-600'
                                        }`}
                                    style={{
                                        maskImage: `url('/assets/icons/${item.icon}')`,
                                        maskSize: 'contain',
                                        maskRepeat: 'no-repeat',
                                        maskPosition: 'center',
                                        WebkitMaskImage: `url('/assets/icons/${item.icon}')`,
                                        WebkitMaskSize: 'contain',
                                        WebkitMaskRepeat: 'no-repeat',
                                        WebkitMaskPosition: 'center',
                                    }}
                                ></span>
                            )}
                            {item.icon && item.isMaterial && (
                                <span className={`material-symbols-outlined w-5 h-5 mr-5 flex-shrink-0 text-xl leading-none transition-colors duration-200 ${activeTab === item.id ? 'text-[#99b849]' : 'text-gray-400 group-hover:text-gray-600'
                                    }`}>
                                    {item.icon}
                                </span>
                            )}
                            {!item.icon && <span className="w-5 h-5 mr-5"></span>}
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100">
                    <Link
                        href={route('logout')}
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

