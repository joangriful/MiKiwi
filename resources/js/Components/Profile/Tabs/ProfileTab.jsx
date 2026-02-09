import React from 'react';
import { usePage } from '@inertiajs/react';

export default function ProfileTab({ setActiveTab }) {
    // Attempt to access user from page props. 
    // If not available, fallback to placeholders for design validation.
    const { auth } = usePage().props;
    const user = auth?.user || {
        name: 'Usuario MiKiwi',
        email: 'usuario@mikiwi.com',
        profile_photo_url: null // Will use default if null
    };

    // Placeholder data for "My Collection" / Orders
    // In a real scenario, this would come from props or an API call
    const myCollection = [
        { id: 1, name: 'Teclado Mecánico MK800', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', date: '12 Ene 2024' },
        { id: 2, name: 'Ratón Gaming G-Pro', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', date: '10 Dic 2023' },
        { id: 3, name: 'Monitor 4K Ultra', image: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', date: '25 Nov 2023' },
        { id: 4, name: 'Auriculares NoiseCancel', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', date: '05 Nov 2023' },
    ];

    return (
        <div className="space-y-6">
            {/* Main Profile Card with Banner */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Banner */}
                <div className="h-48 w-full bg-gradient-to-r from-violet-600 to-indigo-600 relative">
                    {/* Decorative pattern or image overlay could go here */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                </div>

                {/* Profile Info (overlapping banner) */}
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="flex items-end gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="h-32 w-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                                    <img
                                        src={user.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=256`}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                {/* Online/Status Indicator (Optional) */}
                                <div className="absolute bottom-2 right-2 h-5 w-5 bg-green-500 border-4 border-white rounded-full"></div>
                            </div>

                            {/* Text Info */}
                            <div className="mb-1">
                                <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
                                <p className="text-gray-500 font-medium">{user.email}</p>
                            </div>
                        </div>

                        {/* Action Button (e.g., Edit Profile) */}
                        <div className="mb-2 hidden sm:block">
                            <button
                                onClick={() => setActiveTab('edit-account')}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
                            >
                                Editar perfil
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* "My Collection" / Orders Visual Carousel */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#99b849]">inventory_2</span>
                        Mi Colección
                    </h3>
                    {/* View All button removed as requested */}
                </div>

                {/* Horizontal Scroll Container (Carousel) */}
                <div className="flex overflow-x-auto gap-4 pb-4 -mx-2 px-2 scrollbar-hide snap-x">
                    {myCollection.map((item) => (
                        <div key={item.id} className="snap-start flex-shrink-0 w-48 group relative bg-gray-50 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 border border-transparent hover:border-[#99b849]/30">
                            {/* Image Aspect Ratio Container */}
                            <div className="aspect-square bg-gray-200 overflow-hidden relative">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                            </div>

                            {/* Info */}
                            <div className="p-3">
                                <h4 className="font-semibold text-gray-800 text-sm truncate">{item.name}</h4>
                                <p className="text-xs text-gray-500 mt-1">Comprado: {item.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <style>{`
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                    .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
            </div>
        </div>
    );
}
