import React, { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import Toast from '@/Components/Common/Toast';

export default function HeroImageManager({
    images = [],
    title = "Imágenes del Hero",
    description = "Gestiona las imágenes de fondo del hero principal",
    uploadType = "home"
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState(null);
    const fileInputRef = useRef(null);

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));

        if (imageFiles.length > 0) {
            uploadImages(imageFiles);
        } else {
            setToast({ message: 'Solo se permiten archivos de imagen', type: 'error' });
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        uploadImages(files);
    };

    const uploadImages = (files) => {
        setUploading(true);
        const formData = new FormData();
        files.forEach(file => formData.append('images[]', file));
        formData.append('type', uploadType);

        router.post(route('content.hero.upload'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setToast({ message: `${files.length} imagen(es) subida(s) correctamente`, type: 'success' });
                setUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
            onError: () => {
                setToast({ message: 'Error al subir las imágenes', type: 'error' });
                setUploading(false);
            }
        });
    };

    const handleDelete = (imageId) => {
        if (window.confirm('¿Estás seguro de eliminar esta imagen?')) {
            router.delete(route('content.hero.delete', imageId), {
                preserveScroll: true,
                onSuccess: () => {
                    setToast({ message: 'Imagen eliminada correctamente', type: 'success' });
                },
                onError: () => {
                    setToast({ message: 'Error al eliminar la imagen', type: 'error' });
                }
            });
        }
    };

    return (
        <div className="p-6 relative">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>

            {/* Images Grid with Upload Card */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Upload Card */}
                <div
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 border-dashed transition-all cursor-pointer ${isDragging
                        ? 'border-[#99b849] bg-[#99b849]/10'
                        : 'border-gray-300 bg-gray-50 hover:border-[#99b849] hover:bg-gray-100'
                        }`}
                    onClick={() => !uploading && fileInputRef.current?.click()}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        {uploading ? (
                            <div className="text-center">
                                <div className="animate-spin h-8 w-8 border-4 border-[#99b849] border-t-transparent rounded-full mx-auto mb-2"></div>
                                <p className="text-xs text-gray-500">Subiendo...</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <span className="text-6xl font-light text-gray-400">+</span>
                                <p className="text-xs text-gray-500 mt-2">Añadir imagen</p>
                            </div>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={uploading}
                    />
                </div>

                {/* Existing Images */}
                {images.map((image) => (
                    <div key={image.id} className="group relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <img
                            src={image.url}
                            alt={image.public_id}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                onClick={() => window.open(image.url, '_blank')}
                                className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
                                title="Ver imagen"
                            >
                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                            </button>
                            <button
                                onClick={() => handleDelete(image.id)}
                                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                title="Eliminar imagen"
                            >
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
