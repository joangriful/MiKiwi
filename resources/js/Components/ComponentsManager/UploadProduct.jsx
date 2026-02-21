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
    const [galleryText, setGalleryText] = useState('');
    const [hoverImage, setHoverImage] = useState('');
    const [uploading, setUploading] = useState(false);

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
                setMainImage(initialData.images[0] || '');
                setGalleryText(initialData.images.slice(1).join('\n'));
            } else if (initialData.image_url) {
                setMainImage(initialData.image_url);
            }

            setHoverImage(initialData.hover_image_url || '');
        }
    }, [initialData, categories]);

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
            const galleryLinks = galleryText.trim() ? galleryText.split('\n').map(l => l.trim()).filter(Boolean) : [];
            const allImages = [mainImage, ...galleryLinks].filter(Boolean);

            const submitData = {
                ...formData,
                existing_images: allImages,
                hover_image_input: hoverImage.trim()
            };

            const routeName = isEdit ? 'products.update' : 'products.upload';
            const routeParams = isEdit ? initialData.slug : {};

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

    const resetForm = () => {
        setFormData({ name: '', sku: '', category_id: '', description: '', base_price: '', stock_quantity: '', product_type: 'simple', is_adult_only: true, is_active: true });
        setSelectedParentId('');
        setSelectedSubId('');
        setMainImage('');
        setGalleryText('');
        setHoverImage('');
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

                {/* Sección de Imágenes Compacta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Imagen Principal (Cloudinary URL/ID)</label>
                            <input
                                type="text"
                                value={mainImage}
                                onChange={(e) => setMainImage(e.target.value)}
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                placeholder="Public ID o URL"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Imagen Hover</label>
                            <input
                                type="text"
                                value={hoverImage}
                                onChange={(e) => setHoverImage(e.target.value)}
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                placeholder="Public ID o URL (Opcional)"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Galería Carrusel (IDs o URLs, uno por línea)</label>
                        <textarea
                            value={galleryText}
                            onChange={(e) => setGalleryText(e.target.value)}
                            rows={5}
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm resize-none"
                            placeholder={"id_imagen_2\nid_imagen_3\n..."}
                        />
                    </div>
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
