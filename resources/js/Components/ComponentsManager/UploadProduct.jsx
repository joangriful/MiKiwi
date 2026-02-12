import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function UploadProduct({ categories = [] }) {
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

    const [existingImagesText, setExistingImagesText] = useState(''); // IDs or URLs
    const [uploading, setUploading] = useState(false);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Auto-generate SKU
    const generateSKU = () => {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        setFormData(prev => ({ ...prev, sku: `PRD-${timestamp}-${random}` }));
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name) {
            toast.error('El nombre es obligatorio');
            return;
        }
        if (!formData.base_price || parseFloat(formData.base_price) <= 0) {
            toast.error('El precio debe ser mayor a 0');
            return;
        }

        setUploading(true);

        try {
            const submitData = new FormData();

            // Add form fields
            Object.keys(formData).forEach(key => {
                if (formData[key] !== '') {
                    submitData.append(key, formData[key]);
                }
            });

            // Add existing images from text area
            if (existingImagesText.trim()) {
                const existingImagesArray = existingImagesText
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line !== '');

                existingImagesArray.forEach((img, index) => {
                    submitData.append(`existing_images[${index}]`, img);
                });
            }

            router.post(route('products.upload'), submitData, {
                onSuccess: () => {
                    toast.success('✓ Producto creado correctamente');
                    // Reset form
                    setFormData({
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
                    setExistingImagesText('');
                },
                onError: (errors) => {
                    console.error('Upload errors:', errors);
                    toast.error('Error al crear el producto. Revise los campos.');
                },
                onFinish: () => setUploading(false)
            });

        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Error al procesar la solicitud');
            setUploading(false);
        }
    };

    return (
        <div className="h-full overflow-y-auto">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-8 space-y-8">
                <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Subir Nuevo Producto</h2>
                    <p className="text-sm text-gray-500 mt-1">Complete los campos para crear un nuevo producto</p>
                </div>

                {/* Images Selection Section (Only Links/IDs now) */}
                <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Imágenes del Producto (Cloudinary)
                        </label>
                        <p className="text-xs text-gray-400 mt-1">Añade los Public IDs o URLs de las imágenes que ya están en Cloudinary.</p>
                    </div>

                    <textarea
                        value={existingImagesText}
                        onChange={(e) => setExistingImagesText(e.target.value)}
                        placeholder="Ej: hero_images/yo4cilvlpkvjbcpeqqkj&#10;O: https://res.cloudinary.com/...&#10;(Uno por línea)"
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none font-mono text-sm bg-gray-50/50"
                    />

                    <div className="flex items-start gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <span className="material-symbols-outlined text-sm mt-0.5">info</span>
                        <p className="text-xs">
                            <strong>Nota importante:</strong> La primera línea se utilizará como la <strong>imagen principal</strong> del producto. Asegúrate de que el Public ID sea correcto.
                        </p>
                    </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre del Producto *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                            SKU
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                id="sku"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="Opcional"
                            />
                            <button
                                type="button"
                                onClick={generateSKU}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">refresh</span>
                                Auto
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                            Categoría
                        </label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                            <option value="">Seleccione una categoría</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                        placeholder="Descripción detallada del producto..."
                    />
                </div>

                {/* Pricing & Inventory */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="base_price" className="block text-sm font-medium text-gray-700 mb-2">
                            Precio Base (€) *
                        </label>
                        <input
                            type="number"
                            id="base_price"
                            name="base_price"
                            value={formData.base_price}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 mb-2">
                            Cantidad en Stock
                        </label>
                        <input
                            type="number"
                            id="stock_quantity"
                            name="stock_quantity"
                            value={formData.stock_quantity}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Opcional"
                        />
                    </div>
                </div>

                {/* Classification */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Producto
                        </label>
                        <div className="flex gap-4">
                            {['simple', 'configurable', 'component'].map(type => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="product_type"
                                        value={type}
                                        checked={formData.product_type === type}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700 capitalize">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_adult_only"
                                checked={formData.is_adult_only}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="text-sm text-gray-700">Solo para adultos</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="text-sm text-gray-700">Activo</span>
                        </label>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => {
                            setFormData({
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
                            setExistingImagesText('');
                        }}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Limpiar
                    </button>
                    <button
                        type="submit"
                        disabled={uploading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                                Subiendo...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-sm">upload</span>
                                Crear Producto
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
