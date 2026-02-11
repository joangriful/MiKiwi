import React, { useState, useCallback } from 'react';
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

    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

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

    // Handle image uploads
    const handleImageChange = (files) => {
        const fileArray = Array.from(files);

        // Validate file types
        const validFiles = fileArray.filter(file => {
            if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
                toast.error(`${file.name} no es una imagen válida`);
                return false;
            }
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`${file.name} es demasiado grande (máx 10MB)`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        // Add to images array
        setImages(prev => [...prev, ...validFiles]);

        // Create previews
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, { file: file.name, url: reader.result }]);
            };
            reader.readAsDataURL(file);
        });
    };

    // Drag and drop handlers
    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleImageChange(e.dataTransfer.files);
        }
    }, []);

    // Remove image
    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    // Reorder images
    const moveImage = (fromIndex, toIndex) => {
        setImages(prev => {
            const newImages = [...prev];
            const [moved] = newImages.splice(fromIndex, 1);
            newImages.splice(toIndex, 0, moved);
            return newImages;
        });
        setImagePreviews(prev => {
            const newPreviews = [...prev];
            const [moved] = newPreviews.splice(fromIndex, 1);
            newPreviews.splice(toIndex, 0, moved);
            return newPreviews;
        });
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

            // Add images
            images.forEach((image, index) => {
                submitData.append(`images[${index}]`, image);
            });

            const response = await axios.post(route('products.upload'), submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
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
                setImages([]);
                setImagePreviews([]);
            } else {
                toast.error(response.data.message || 'Error al crear el producto');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Error al crear el producto');
        } finally {
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

                {/* Images Upload Section */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Imágenes del Producto
                    </label>

                    {/* Drag & Drop Zone */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${dragActive
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            id="image-upload"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleImageChange(e.target.files)}
                            className="hidden"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                            <span className="material-symbols-outlined text-4xl text-gray-400 mb-2 block">upload</span>
                            <p className="text-gray-600 font-medium">Arrastra imágenes aquí o haz click para seleccionar</p>
                            <p className="text-sm text-gray-400 mt-1">JPG, PNG o WEBP (máx 10MB)</p>
                        </label>
                    </div>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-4 gap-4">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={preview.url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                    />
                                    {index === 0 && (
                                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                            Principal
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => moveImage(index, index - 1)}
                                            className="absolute bottom-2 left-2 bg-white text-gray-700 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                        >
                                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                                        </button>
                                    )}
                                    {index < imagePreviews.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={() => moveImage(index, index + 1)}
                                            className="absolute bottom-2 right-2 bg-white text-gray-700 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                        >
                                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
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
                            setImages([]);
                            setImagePreviews([]);
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
