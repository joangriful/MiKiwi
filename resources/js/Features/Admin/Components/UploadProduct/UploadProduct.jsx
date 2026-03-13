import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './UploadProduct.css';

export default function UploadProduct({ categories = [], initialData = null, onCancel }) {
    const isEdit = !!initialData;

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category_id: '',
        description: '',
        base_price: '',
        stock_quantity: '',
        product_type: 'simple',
        is_adult_only: true,
        is_active: true,
    });

    // ─── Categoría en cascada ──────────────────────────────────────────────────
    const parentCategories = categories.filter(c => !c.parent_id);
    const [selectedParentId, setSelectedParentId] = useState('');
    const [selectedSubId, setSelectedSubId] = useState('');

    const subCategories = selectedParentId
        ? (categories.find(c => String(c.id) === String(selectedParentId))?.children || [])
        : [];

    const [mainImage, setMainImage] = useState('');
    const [hoverImage, setHoverImage] = useState('');
    const [galleryImages, setGalleryImages] = useState([]);
    const [cloudinaryImages, setCloudinaryImages] = useState([]); // Fixed reference error

    const [isDragging, setIsDragging] = useState(false);
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Dual Upload States
    const [uploadMethod, setUploadMethod] = useState('upload'); // 'upload' | 'link'
    const [manualLinkFolder, setManualLinkFolder] = useState('');
    const [isLinking, setIsLinking] = useState(false);

    const handleLinkFolder = async () => {
        if (!manualLinkFolder.trim() || !formData.name) return;
        setIsLinking(true);
        try {
            const response = await axios.post('/admin/products/link-folder', {
                product_name: formData.name,
                source: manualLinkFolder
            });
            if (response.data.success) {
                toast.success(response.data.message);
                setManualLinkFolder('');

                // Fetch resulting images
                const resImages = await axios.get('/admin/products/cloudinary-images', {
                    params: { product_name: formData.name }
                });

                const fetchedImages = resImages.data.images || [];
                if (fetchedImages.length > 0) {
                    setGalleryImages(prev => {
                        const merged = [...new Set([...prev, ...fetchedImages])];
                        if (!mainImage) setMainImage(merged[0]);
                        if (!hoverImage && merged.length > 1) setHoverImage(merged[1]);
                        return merged;
                    });
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Error al vincular la carpeta');
        } finally {
            setIsLinking(false);
        }
    };

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                sku: initialData.sku || '',
                category_id: initialData.category_id || '',
                description: initialData.description || '',
                base_price: initialData.base_price || '',
                stock_quantity: initialData.stock_quantity || '',
                product_type: initialData.product_type || 'simple',
                is_adult_only: !!initialData.is_adult_only,
                is_active: !!initialData.is_active,
            });

            if (initialData.category_id) {
                const existingCat = categories.find(c => String(c.id) === String(initialData.category_id));
                if (existingCat) {
                    if (existingCat.parent_id) {
                        setSelectedParentId(String(existingCat.parent_id));
                        setSelectedSubId(String(existingCat.id));
                    } else {
                        setSelectedParentId(String(existingCat.id));
                        setSelectedSubId('');
                    }
                }
            }

            if (Array.isArray(initialData.images)) {
                setGalleryImages(initialData.images);
                setMainImage(initialData.image_url || initialData.images[0] || '');
            } else if (initialData.image_url) {
                setMainImage(initialData.image_url);
                setGalleryImages([initialData.image_url]);
            }

            setHoverImage(initialData.hover_image_url || '');
        }
    }, [initialData, categories]);

    const handleDragEnter = (e) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    };
    const handleDragOver = (e) => {
        e.preventDefault(); e.stopPropagation();
    };

    const handleDrop = async (e) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(false);

        if (!formData.name) {
            toast.error('Primero debes escribir el nombre del producto para crear su carpeta.');
            return;
        }

        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        if (files.length === 0) return;

        await validateAndUploadImages(files);
    };

    const handleFileSelect = async (e) => {
        if (!formData.name) {
            toast.error('Primero debes escribir el nombre del producto para crear su carpeta.');
            return;
        }

        const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
        if (files.length === 0) return;

        await validateAndUploadImages(files);
    };

    const validateAndUploadImages = async (files) => {
        setIsUploadingImages(true);
        const data = new FormData();
        files.forEach(file => data.append('images[]', file));
        data.append('product_name', formData.name);

        try {
            const response = await axios.post('/admin/products/upload-images', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                toast.success(response.data.message);
                const newUrls = response.data.urls || [];

                setGalleryImages(prev => {
                    const merged = [...prev, ...newUrls];
                    if (!mainImage && merged.length > 0) setMainImage(merged[0]);
                    if (!hoverImage && merged.length > 1) setHoverImage(merged[1]);
                    return merged;
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Error subiendo imágenes');
        } finally {
            setIsUploadingImages(false);
        }
    };

    useEffect(() => {
        const targetId = selectedSubId || selectedParentId || '';
        setFormData(prev => ({ ...prev, category_id: targetId }));
    }, [selectedParentId, selectedSubId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.base_price) {
            toast.error('Nombre y precio obligatorios');
            return;
        }

        setUploading(true);

        try {
            // Priority: if we have manually selected main/hover, use them. 
            // Otherwise default to first two of gallery.
            const imagesToSend = galleryImages.length > 0 ? galleryImages : cloudinaryImages;
            const primary = mainImage || (imagesToSend[0] || '');
            const hover = hoverImage || (imagesToSend[1] || '');

            const submitData = {
                ...formData,
                images: imagesToSend,
                image_url: primary,
                hover_image_url: hover
            };

            const routeName = isEdit ? 'products.update' : 'products.upload';
            const routeParams = isEdit ? initialData.id : {};

            router.visit(route(routeName, routeParams), {
                method: isEdit ? 'put' : 'post',
                data: submitData,
                onSuccess: () => {
                    toast.success(isEdit ? '✓ Producto actualizado' : '✓ Producto creado');
                    if (!isEdit) {
                        resetForm();
                    } else if (onCancel) onCancel();
                },
                onError: (errors) => {
                    toast.error(`Error: ${Object.values(errors).flat().join(' ')}`);
                },
                onFinish: () => setUploading(false)
            });
        } catch (error) {
            setUploading(false);
            toast.error('Error al procesar');
        }
    };

    const autoSaveImages = async (newMain, newHover) => {
        setMainImage(newMain);
        setHoverImage(newHover);

        if (isEdit && initialData && initialData.id) {
            router.put(route('products.update', initialData.id), {
                ...formData,
                image_url: newMain,
                hover_image_url: newHover,
                images: galleryImages,
            }, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    toast.success('Imagen guardada automáticamente', { duration: 1500 });
                },
                onError: (errors) => {
                    console.error("Auto-save failed", errors);
                    toast.error('Error al guardar la imagen seleccionada automáticamente');
                }
            });
        }
    };

    const resetForm = () => {
        setFormData({ name: '', sku: '', category_id: '', description: '', base_price: '', stock_quantity: '', product_type: 'simple', is_adult_only: true, is_active: true });
        setSelectedParentId('');
        setSelectedSubId('');
        setMainImage('');
        setGalleryImages([]);
        setHoverImage('');
        setCloudinaryImages([]);
    };

    return (
        <div className="h-full overflow-y-auto">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-8 space-y-8">
                <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isEdit ? 'Editar Producto' : 'Subir Nuevo Producto'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {isEdit ? `Editando: ${formData.name}` : 'Complete los campos para crear un nuevo producto'}
                    </p>
                </div>

                {/* Sección de Imágenes (Subir vs Vincular) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <h3 className="text-lg font-semibold text-gray-800">Galería del Producto</h3>

                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                type="button"
                                onClick={() => setUploadMethod('upload')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${uploadMethod === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Subir Archivos
                            </button>
                            <button
                                type="button"
                                onClick={() => setUploadMethod('link')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${uploadMethod === 'link' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Vincular Carpeta
                            </button>
                        </div>
                    </div>

                    {isUploadingImages && <span className="text-sm text-blue-500 flex items-center gap-2"><span className="material-symbols-outlined text-sm animate-spin">refresh</span> Subiendo imágenes...</span>}

                    {uploadMethod === 'upload' ? (
                        <div
                            onDragEnter={handleDragEnter}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`relative w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors overflow-hidden ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
                        >
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center pointer-events-none text-gray-500 gap-2">
                                <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                                <span className="font-medium text-sm">
                                    {isDragging ? 'Suelta aquí' : (formData.name ? 'Arrastra imágenes o haz click para subir' : 'Escribe arriba el nombre del producto primero para poder subir fotos')}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex flex-col gap-3">
                            <p className="text-sm text-blue-800">
                                <strong>¿Ya tienes las fotos en Cloudinary?</strong> Escribe el nombre exacto de la carpeta (o pega la URL de una foto). La carpeta será vinculada y renombrada automáticamente a "productos/{formData.name || '{nombre-del-producto}'}".
                            </p>
                            <div className="flex gap-2 relative z-20">
                                <input
                                    type="text"
                                    placeholder="Ej: mobiliario-oficina, o URL..."
                                    value={manualLinkFolder}
                                    onChange={(e) => setManualLinkFolder(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
                                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                />
                                <button
                                    type="button"
                                    onClick={handleLinkFolder}
                                    disabled={isLinking || !manualLinkFolder.trim() || !formData.name}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm disabled:opacity-50 transition-colors cursor-pointer"
                                >
                                    {isLinking ? 'Vinculando...' : 'Vincular y Renombrar'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- ENLACES MANUALES --- */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-4 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-blue-600">link</span>
                            <h4 className="font-bold text-gray-700 uppercase p-0 m-0 text-sm">Enlaces manuales de Cloudinary</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-500 uppercase">Imagen Principal (URL)</label>
                                <input
                                    type="text"
                                    value={mainImage}
                                    onChange={(e) => setMainImage(e.target.value)}
                                    placeholder="https://res.cloudinary.com/..."
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-500 uppercase">Imagen Hover (URL)</label>
                                <input
                                    type="text"
                                    value={hoverImage}
                                    onChange={(e) => setHoverImage(e.target.value)}
                                    placeholder="https://res.cloudinary.com/..."
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-500 uppercase">Imágenes del Carrusel (Una por línea o separadas por comas)</label>
                            <textarea
                                value={galleryImages.join('\n')}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const urls = val.split(/[,\n]/).map(u => u.trim()).filter(u => u !== '');
                                    setGalleryImages(urls);
                                }}
                                rows={3}
                                placeholder="Pega aquí todos los enlaces del carrusel..."
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            />
                        </div>
                    </div>

                    {isUploadingImages && (
                        <div className="mb-4 text-center text-sm font-medium text-blue-600 animate-pulse bg-blue-50 py-2 rounded">
                            Subiendo a Cloudinary... por favor, espera.
                        </div>
                    )}

                    {galleryImages.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {galleryImages.map((imgUrl, idx) => {
                                const isMain = mainImage === imgUrl;
                                const isHover = hoverImage === imgUrl;
                                return (
                                    <div key={idx} className={`relative group rounded-lg overflow-hidden border-2 transition-all ${isMain ? 'border-blue-500 shadow-md transform scale-[1.02]' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className="aspect-square bg-gray-100 cursor-pointer" onClick={() => autoSaveImages(imgUrl, hoverImage)}>
                                            <img src={imgUrl} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                                        </div>

                                        {/* Badges / Controls */}
                                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                                            {isMain && <span className="bg-blue-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm">Principal</span>}
                                            {isHover && <span className="bg-purple-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm">Hover</span>}
                                        </div>

                                        {/* Drop action button to remove */}
                                        <button
                                            type="button"
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => {
                                                setGalleryImages(prev => prev.filter(v => v !== imgUrl));
                                                if (isMain) setMainImage('');
                                                if (isHover) setHoverImage('');
                                            }}
                                        >
                                            <span className="material-symbols-outlined text-xs">close</span>
                                        </button>

                                        {/* Hover Actions */}
                                        <div className={`absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-2 flex justify-between items-center transition-transform ${(!isMain && !isHover) ? 'translate-y-full group-hover:translate-y-0' : ''}`}>
                                            <button
                                                type="button"
                                                onClick={() => autoSaveImages(mainImage, isHover ? '' : imgUrl)}
                                                className={`text-[10px] font-bold px-2 py-1 rounded w-full transition-colors ${isHover ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                            >
                                                {isHover ? 'Quitar Hover' : 'Hacer Hover'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {galleryImages.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                            Haz clic en una imagen para hacerla <strong className="text-blue-500">Principal</strong>. Usa el botón inferior para marcarla o desmarcarla como <strong className="text-purple-500">Hover</strong>. Todas las imágenes mostradas formarán parte de la galería del producto.
                        </p>
                    )}
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setFormData(p => ({ ...p, sku: `PRD-${Date.now().toString().slice(-6)}` }))}
                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                            >
                                Auto
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                        <div className="flex flex-col gap-2">
                            <select
                                value={selectedParentId}
                                onChange={(e) => { setSelectedParentId(e.target.value); setSelectedSubId(''); }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                            >
                                <option value="">— Seleccionar Padre —</option>
                                {parentCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>

                            {subCategories.length > 0 && (
                                <select
                                    value={selectedSubId}
                                    onChange={(e) => setSelectedSubId(e.target.value)}
                                    className="w-full px-4 py-2 border border-[#99b849] rounded-lg bg-white text-sm"
                                >
                                    <option value="">— Seleccionar Subcategoría —</option>
                                    {subCategories.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                                </select>
                            )}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                </div>

                {/* Pricing & Inventory */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Precio Base (€) *</label>
                        <input
                            type="number"
                            name="base_price"
                            value={formData.base_price}
                            onChange={handleChange}
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                        <input
                            type="number"
                            name="stock_quantity"
                            value={formData.stock_quantity}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* Booleans */}
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="is_adult_only" checked={formData.is_adult_only} onChange={handleChange} className="w-4 h-4" />
                        <span className="text-sm text-gray-700">Solo adultos</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-4 h-4" />
                        <span className="text-sm text-gray-700">Producto Activo</span>
                    </label>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel || resetForm}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        {isEdit ? 'Cancelar' : 'Limpiar'}
                    </button>
                    <button
                        type="submit"
                        disabled={uploading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        {uploading ? 'Guardando...' : (isEdit ? 'Guardar Cambios' : 'Crear Producto')}
                    </button>
                </div>
            </form>
        </div>
    );
}
