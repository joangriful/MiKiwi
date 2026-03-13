import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import './ImageEditorModal.css';

export default function ImageEditorModal({
    isOpen,
    onClose,
    aspectRatio = 1,
    onSave,
    type = 'profile', // 'profile' or 'banner'
    existingImageUrl = null // Optional: for editing existing images
}) {
    const [imageUrl, setImageUrl] = useState(existingImageUrl);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [saving, setSaving] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Handle file selection
    const handleFileSelect = (file) => {
        if (!file) return;

        // Validate file type
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
            alert('Por favor selecciona una imagen JPEG o PNG');
            return;
        }

        // Validate file size
        const maxSize = type === 'banner' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert(`La imagen debe ser menor a ${type === 'banner' ? '10MB' : '5MB'}`);
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Handle drag events
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const maxSize = Math.max(image.width, image.height);
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

        canvas.width = safeArea;
        canvas.height = safeArea;

        ctx.translate(safeArea / 2, safeArea / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-safeArea / 2, -safeArea / 2);

        ctx.drawImage(
            image,
            safeArea / 2 - image.width * 0.5,
            safeArea / 2 - image.height * 0.5
        );

        const data = ctx.getImageData(0, 0, safeArea, safeArea);

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.putImageData(
            data,
            Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
            Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg', 0.95);
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const croppedBlob = await getCroppedImg(
                imageUrl,
                croppedAreaPixels,
                rotation
            );
            onSave(croppedBlob);
            handleClose();
        } catch (e) {
            console.error('Error cropping image:', e);
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setImageUrl(existingImageUrl);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
            <div className="relative w-full h-full max-w-6xl max-h-screen p-8 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">
                        {type === 'banner' ? 'Editar Banner' : 'Editar Foto de Perfil'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-white hover:text-gray-300 transition-colors"
                    >
                        <span className="material-symbols-outlined text-3xl">close</span>
                    </button>
                </div>

                {/* Content Area */}
                {!imageUrl ? (
                    // Drag & Drop Zone (shown when no image selected)
                    <div className="flex-1 flex items-center justify-center">
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`w-full max-w-2xl border-4 border-dashed rounded-3xl p-16 transition-all duration-300 cursor-pointer ${dragActive
                                    ? 'border-[#99b849] bg-[#99b849]/10'
                                    : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
                                }`}
                            onClick={() => document.getElementById('file-input-editor').click()}
                        >
                            <div className="flex flex-col items-center gap-6 text-center">
                                <span className="material-symbols-outlined text-8xl text-gray-400">
                                    {dragActive ? 'download' : 'cloud_upload'}
                                </span>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {dragActive ? 'Suelta la imagen aquí' : 'Arrastra y suelta tu imagen'}
                                    </h3>
                                    <p className="text-gray-400 text-lg">
                                        o haz click para seleccionar un archivo
                                    </p>
                                </div>
                                <div className="text-sm text-gray-500 space-y-1">
                                    <p>Formatos soportados: JPEG, JPG, PNG</p>
                                    <p>Tamaño máximo: {type === 'banner' ? '10MB' : '5MB'}</p>
                                </div>
                            </div>
                            <input
                                id="file-input-editor"
                                type="file"
                                onChange={handleFileInput}
                                accept="image/jpeg,image/jpg,image/png"
                                className="hidden"
                            />
                        </div>
                    </div>
                ) : (
                    // Image Editor (shown after image is selected)
                    <>
                        {/* Cropper Area */}
                        <div className="relative flex-1 bg-gray-900 rounded-lg overflow-hidden mb-4">
                            <Cropper
                                image={imageUrl}
                                crop={crop}
                                zoom={zoom}
                                rotation={rotation}
                                aspect={aspectRatio}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                onRotationChange={setRotation}
                                showGrid={true}
                                cropShape={type === 'profile' ? 'round' : 'rect'}
                            />
                        </div>

                        {/* Controls */}
                        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
                            {/* Zoom Slider */}
                            <div className="space-y-2">
                                <label className="text-white text-sm font-medium flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">zoom_in</span>
                                    Zoom: {zoom.toFixed(1)}x
                                </label>
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    value={zoom}
                                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#99b849]"
                                />
                            </div>

                            {/* Rotation Buttons */}
                            <div className="space-y-2">
                                <label className="text-white text-sm font-medium flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">rotate_right</span>
                                    Rotación: {rotation}°
                                </label>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setRotation((r) => r - 90)}
                                        className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">rotate_left</span>
                                        -90°
                                    </button>
                                    <button
                                        onClick={() => setRotation(0)}
                                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={() => setRotation((r) => r + 90)}
                                        className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">rotate_right</span>
                                        +90°
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setImageUrl(null)}
                                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                                >
                                    Cambiar Imagen
                                </button>
                                <button
                                    onClick={handleClose}
                                    disabled={saving}
                                    className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 px-6 py-3 bg-[#99b849] hover:bg-[#88a73e] text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin">refresh</span>
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">check</span>
                                            Guardar y Subir
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
