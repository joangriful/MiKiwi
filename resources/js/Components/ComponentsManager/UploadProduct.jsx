import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'react-toastify';

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

    const [cloudinaryImages, setCloudinaryImages] = useState([]);
    const [isLoadingImages, setIsLoadingImages] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Manual folder link
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

                // Re-fetch images after linking/renaming
                setIsLoadingImages(true);
                const resImages = await axios.get('/admin/products/cloudinary-images', {
                    params: { product_name: formData.name } // esto buscará en 'productos/NombreActual' 
                });
                const fetchedImages = resImages.data.images || [];
                setCloudinaryImages(fetchedImages);

                // Si la galería de BD está vacía, auto-popular
                if (fetchedImages.length > 0 && galleryImages.length === 0) {
                    setGalleryImages(fetchedImages);
                    if (!mainImage) setMainImage(fetchedImages[0]);
                    if (!hoverImage && fetchedImages.length > 1) setHoverImage(fetchedImages[1]);
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Error al vincular la carpeta');
        } finally {
            setIsLoadingImages(false);
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

    useEffect(() => {
        if (!formData.name) {
            setCloudinaryImages([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoadingImages(true);
            try {
                const response = await axios.get('/admin/products/cloudinary-images', {
                    params: { product_name: formData.name }
                });
                const fetchedImages = response.data.images || [];
                setCloudinaryImages(fetchedImages);

                // Si estamos creando uno nuevo y no hay galería seteada, auto-asignamos todo
                if (!isEdit && fetchedImages.length > 0 && galleryImages.length === 0) {
                    setGalleryImages(fetchedImages);
                    if (!mainImage) setMainImage(fetchedImages[0]);
                    if (!hoverImage && fetchedImages.length > 1) setHoverImage(fetchedImages[1]);
                }
            } catch (error) {
                console.error('Error fetching images:', error);
            } finally {
                setIsLoadingImages(false);
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [formData.name]);

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
            const finalGallery = cloudinaryImages.length > 0 ? cloudinaryImages : galleryImages;

            const submitData = {
                ...formData,
                images: finalGallery,
                image_url: mainImage,
                hover_image_url: hoverImage
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

                {/* Sección de Imágenes de Cloudinary */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <h3 className="text-lg font-semibold text-gray-800">Galería del Producto (Cloudinary)</h3>
                        {isLoadingImages && <span className="text-sm text-blue-500 flex items-center gap-2"><span className="material-symbols-outlined text-sm animate-spin">refresh</span> Buscando imágenes...</span>}
                    </div>

                    {!formData.name ? (
                        <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg text-center border border-dashed border-gray-300">
                            Escribe el nombre del producto abajo para buscar sus imágenes automáticamente.
                        </div>
                    ) : cloudinaryImages.length === 0 && !isLoadingImages ? (
                        <div className="text-sm text-yellow-600 bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex flex-col gap-3">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined mt-0.5">warning</span>
                                <div>
                                    <p className="font-semibold">No se encontraron imágenes en productos/{formData.name}</p>
                                    <p>Asegúrate de que en Cloudinary exista o vincula manualmente a continuación.</p>
                                </div>
                            </div>
                            <div className="mt-2 pt-3 border-t border-yellow-200/50">
                                <p className="mb-2 font-medium">¿La carpeta tiene otro nombre? Escribe su nombre o pega una URL para vincularla a "{formData.name}":</p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Ej: mobi, productos/mobi, o URL de imagen"
                                        value={manualLinkFolder}
                                        onChange={(e) => setManualLinkFolder(e.target.value)}
                                        className="flex-1 px-3 py-1.5 border border-yellow-300 rounded text-sm bg-white outline-none focus:border-yellow-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleLinkFolder}
                                        disabled={isLinking || !manualLinkFolder.trim()}
                                        className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded font-medium text-sm disabled:opacity-50 transition-colors"
                                    >
                                        {isLinking ? 'Vinculando...' : 'Vincular'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : cloudinaryImages.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {cloudinaryImages.map((imgUrl, idx) => {
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
                    ) : null}

                    {cloudinaryImages.length > 0 && (
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
