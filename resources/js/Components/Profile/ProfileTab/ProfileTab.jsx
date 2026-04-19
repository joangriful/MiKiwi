import React, { useState } from 'react';
import { usePage, router, Link } from '@inertiajs/react';
import { toast } from 'react-toastify';
import ImageEditorModal from '@/Components/Profile/ImageEditorModal/ImageEditorModal';
import useProfileMediaUpload from '@/Features/Profile/hooks/useProfileMediaUpload';
import { getErrorMessage } from '@/Shared/Errors/errorMessage';
import styles from './ProfileTab.module.css';

export default function ProfileTab({ setActiveTab, recommendedProducts = [] }) {
    const { uploadAvatarImage, uploadBannerImage } = useProfileMediaUpload();
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
            const response = await uploadAvatarImage(formData);

            if (response.success) {
                setCurrentProfileImage(response.profile_photo_url);
                toast.success('✓ Foto de perfil actualizada correctamente');
                // Force page props update
                router.reload({ only: ['auth'] });
            } else {
                toast.error(response.message || 'Error al subir la imagen');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(getErrorMessage(error, 'Error al subir la imagen. Por favor, inténtalo de nuevo.'));
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
            const response = await uploadBannerImage(formData);

            if (response.success) {
                setCurrentBannerImage(response.banner_url);
                toast.success('✓ Banner actualizado correctamente');
                // Force page props update
                router.reload({ only: ['auth'] });
            } else {
                toast.error(response.message || 'Error al subir el banner');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(getErrorMessage(error, 'Error al subir el banner. Por favor, inténtalo de nuevo.'));
        } finally {
            setUploadingBanner(false);
        }
    };

    return (
        <div className={`${styles.root} space-y-6`}>
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

            {/* Recommendaciones basadas en el Quiz */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#99b849]">magic_button</span>
                        Recomendados para ti
                    </h3>
                    {recommendedProducts && recommendedProducts.length > 0 && (
                        <Link href="/configurador/quiz" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">refresh</span>
                            Repetir Quiz
                        </Link>
                    )}
                </div>

                {/* Contenedor dinámico: Mostrar prompt de Quiz o Productos */}
                {recommendedProducts && recommendedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recommendedProducts.map((product) => (
                            <div key={product.id} className="flex flex-col bg-white group relative transition-all duration-500 hover:-translate-y-2 flex-shrink-0 min-w-[280px] sm:min-w-[320px] md:min-w-0 md:max-w-[380px] md:mx-auto overflow-hidden rounded-[24px]">
                                {/* Category Badge - Inside Card, Top Left */}
                                {product.category && (
                                    <div className="absolute top-3 left-3 z-20 bg-[#99b849] text-white px-3 py-1 rounded-full transition-all duration-500 group-hover:scale-110">
                                        <span className="text-xs font-semibold">{product.category.name}</span>
                                    </div>
                                )}

                                {/* Image Container */}
                                <div className="relative aspect-[4/5] bg-[#F3F3F3] overflow-hidden">
                                    {product.image_url ? (
                                        <>
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            {product.hover_image_url && (
                                                <img
                                                    src={product.hover_image_url}
                                                    alt={`${product.name} hover`}
                                                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                                    )}

                                    {/* Like Button - Minimalist Overlay */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                        }}
                                        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center transition-all bg-white/60 hover:bg-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100"
                                    >
                                        <div className="w-5 h-5 transition-colors duration-200 bg-black"
                                            style={{
                                                maskImage: `url('/assets/icons/MdiCardsHeartOutline.svg')`,
                                                maskSize: 'contain',
                                                maskRepeat: 'no-repeat',
                                                maskPosition: 'center',
                                                WebkitMaskImage: `url('/assets/icons/MdiCardsHeartOutline.svg')`,
                                                WebkitMaskSize: 'contain',
                                                WebkitMaskRepeat: 'no-repeat',
                                                WebkitMaskPosition: 'center',
                                            }}
                                        ></div>
                                    </button>
                                </div>

                                {/* Info Section - Minimalist & Prioritizing Text */}
                                <div className="flex flex-col pt-6 pb-4 px-2 space-y-2">
                                    <div className="flex justify-between items-baseline gap-4">
                                        <h3 className="text-base font-bold text-black uppercase tracking-widest leading-tight flex-1">{product.name}</h3>
                                        <span className="text-base font-medium text-black/80">
                                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.base_price)}
                                        </span>
                                    </div>
                                    <div className="h-px bg-black/5 w-12 transition-all duration-500 group-hover:w-full" />
                                    <p className="text-xs text-black/40 line-clamp-2 leading-relaxed transition-colors group-hover:text-black/60">
                                        {product.description || 'Ingeniería sensorial premium'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
                        <span className="material-symbols-outlined text-4xl text-[#99b849] mb-4">quiz</span>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Descubre tu estilo ideal</h4>
                        <p className="text-sm text-gray-500 max-w-md mb-6">
                            Completa nuestro quiz inicial para que podamos recomendarte los productos que mejor se adapten a tus gustos y preferencias.
                        </p>
                        <Link href="/configurador/quiz" className="px-6 py-2 bg-[#99b849] hover:bg-[#86a340] text-white font-medium rounded-lg transition-colors">
                            Realizar el Quiz
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
