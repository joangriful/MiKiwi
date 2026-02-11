import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ImageEditorModal from '../ImageEditorModal';

export default function ProfileTab({ setActiveTab }) {
    const { auth } = usePage().props;
    const user = auth?.user || {
        name: 'Usuario MiKiwi',
        email: 'usuario@mikiwi.com',
        profile_photo_url: null,
        banner_url: null
    };

    // State for image uploads
    const [uploadingProfile, setUploadingProfile] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);

    // Current displayed images (updated after successful upload)
    const [currentProfileImage, setCurrentProfileImage] = useState(user.profile_photo_url);
    const [currentBannerImage, setCurrentBannerImage] = useState(user.banner_url);

    // Image editor state
    const [editorOpen, setEditorOpen] = useState(false);
    const [editingType, setEditingType] = useState('profile'); // 'profile' or 'banner'
    const [existingImage, setExistingImage] = useState(null); // Track the existing image for the editor

    // Placeholder data for "My Collection" / Orders
    const myCollection = [
        { id: 1, name: 'Teclado Mecánico MK800', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', date: '12 Ene 2024' },
        { id: 2, name: 'Ratón Gaming G-Pro', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', date: '10 Dic 2023' },
        { id: 3, name: 'Monitor 4K Ultra', image: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', date: '25 Nov 2023' },
        { id: 4, name: 'Auriculares NoiseCancel', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', date: '05 Nov 2023' },
    ];

    // Open editor for profile image
    const handleEditProfileImage = () => {
        setEditingType('profile');
        setExistingImage(currentProfileImage);
        setEditorOpen(true);
    };

    // Open editor for banner
    const handleEditBanner = () => {
        setEditingType('banner');
        setExistingImage(currentBannerImage);
        setEditorOpen(true);
    };

    // Handle save from image editor
    const handleEditorSave = async (croppedBlob) => {
        if (editingType === 'profile') {
            await uploadProfileImage(croppedBlob);
        } else {
            await uploadBanner(croppedBlob);
        }
    };

    // Upload profile image
    const uploadProfileImage = async (blob) => {
        setUploadingProfile(true);

        const formData = new FormData();
        formData.append('image', blob, 'profile.jpg');

        try {
            const response = await axios.post(route('profile.image.update'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setCurrentProfileImage(response.data.profile_photo_url);
                toast.success('✓ Foto de perfil actualizada correctamente');
                // Force page props update
                router.reload({ only: ['auth'] });
            } else {
                toast.error(response.data.message || 'Error al subir la imagen');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Error al subir la imagen. Por favor, inténtalo de nuevo.');
        } finally {
            setUploadingProfile(false);
        }
    };

    // Upload banner
    const uploadBanner = async (blob) => {
        setUploadingBanner(true);

        const formData = new FormData();
        formData.append('image', blob, 'banner.jpg');

        try {
            const response = await axios.post(route('profile.banner.update'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setCurrentBannerImage(response.data.banner_url);
                toast.success('✓ Banner actualizado correctamente');
                // Force page props update
                router.reload({ only: ['auth'] });
            } else {
                toast.error(response.data.message || 'Error al subir el banner');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Error al subir el banner. Por favor, inténtalo de nuevo.');
        } finally {
            setUploadingBanner(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Image Editor Modal */}
            <ImageEditorModal
                isOpen={editorOpen}
                onClose={() => setEditorOpen(false)}
                aspectRatio={editingType === 'profile' ? 1 : 16 / 4}
                onSave={handleEditorSave}
                type={editingType}
                existingImageUrl={existingImage}
            />

            {/* Main Profile Card with Banner */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Banner with Edit Overlay */}
                <div className="h-48 w-full relative group">
                    {/* Banner Image */}
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600"
                        style={currentBannerImage ? {
                            backgroundImage: `url(${currentBannerImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        } : {}}
                    >
                        {!currentBannerImage && (
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        )}
                    </div>

                    {/* Edit Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                        <button
                            onClick={handleEditBanner}
                            disabled={uploadingBanner}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2 bg-white text-gray-800 rounded-lg font-medium shadow-lg hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50"
                        >
                            {uploadingBanner ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                                    Subiendo...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                    {currentBannerImage ? 'Editar Banner' : 'Añadir Banner'}
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Profile Info (overlapping banner) */}
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="flex items-end gap-6">
                            {/* Avatar with Edit Overlay */}
                            <div className="relative group">
                                <div className="h-32 w-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                                    <img
                                        src={currentProfileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=256`}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                {/* Edit Button Overlay */}
                                {!uploadingProfile && (
                                    <button
                                        onClick={handleEditProfileImage}
                                        disabled={uploadingProfile}
                                        className="absolute inset-0 bg-black/0 group-hover:bg-black/50 rounded-full transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                                    >
                                        <span className="material-symbols-outlined text-white text-3xl">edit</span>
                                    </button>
                                )}

                                {/* Uploading Indicator */}
                                {uploadingProfile && (
                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white text-3xl animate-spin">refresh</span>
                                    </div>
                                )}

                                {/* Online/Status Indicator */}
                                {!uploadingProfile && (
                                    <div className="absolute bottom-2 right-2 h-5 w-5 bg-green-500 border-4 border-white rounded-full"></div>
                                )}
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
