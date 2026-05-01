import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { extractImageFiles } from '@/Utils/imageFiles';
import styles from './UploadProduct.module.css';

function getMethodButtonClassName(stylesObject, uploadMethod, targetMethod) {
    return `${stylesObject.methodButton} ${uploadMethod === targetMethod ? stylesObject.methodButtonActive : ''}`;
}

function getDropzoneClassName(stylesObject, isDragging) {
    return `${stylesObject.dropzone} ${isDragging ? stylesObject.dropzoneDragging : ''}`;
}

function getGalleryItemClassName(stylesObject, isMain) {
    return `${stylesObject.galleryItem} ${isMain ? stylesObject.galleryItemMain : ''}`;
}

function getHoverToggleClassName(stylesObject, isHover) {
    return `${stylesObject.hoverToggleButton} ${isHover ? stylesObject.hoverToggleButtonActive : stylesObject.hoverToggleButtonInactive}`;
}

export default function UploadProduct({ categories = [], initialData = null, onCancel }) {
    const isEdit = !!initialData;
    const isFlatCategoryModel = categories.every((category) => !category.parent_id && (!Array.isArray(category.children) || category.children.length === 0));

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
    const parentCategories = isFlatCategoryModel ? categories : categories.filter((category) => !category.parent_id);
    const [selectedParentId, setSelectedParentId] = useState('');
    const [selectedSubId, setSelectedSubId] = useState('');

    const subCategories = !isFlatCategoryModel && selectedParentId
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
                source: manualLinkFolder,
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
                    setGalleryImages((prev) => {
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
                    if (!isFlatCategoryModel && existingCat.parent_id) {
                        setSelectedParentId(String(existingCat.parent_id));
                        setSelectedSubId(String(existingCat.id));
                    } else {
                        setSelectedParentId(String(existingCat.id));
                        setSelectedSubId('');
                    }
                }
            }

            if (Array.isArray(initialData.images)) {
                const normalizedImages = initialData.images
                    .map((image) => typeof image === 'string' ? image : image?.url)
                    .filter(Boolean);

                setGalleryImages(normalizedImages);
                setMainImage(initialData.image_url || normalizedImages[0] || '');
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

        const files = extractImageFiles(e.dataTransfer.files);
        if (files.length === 0) return;

        await validateAndUploadImages(files);
    };

    const handleFileSelect = async (e) => {
        if (!formData.name) {
            toast.error('Primero debes escribir el nombre del producto para crear su carpeta.');
            return;
        }

        const files = extractImageFiles(e.target.files);
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
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                toast.success(response.data.message);
                const newUrls = response.data.urls || [];

                setGalleryImages((prev) => {
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
        const targetId = isFlatCategoryModel ? selectedParentId : (selectedSubId || selectedParentId || '');
        setFormData(prev => ({ ...prev, category_id: targetId }));
    }, [isFlatCategoryModel, selectedParentId, selectedSubId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
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
                hover_image_url: hover,
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
                onFinish: () => setUploading(false),
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
                    console.error('Auto-save failed', errors);
                    toast.error('Error al guardar la imagen seleccionada automáticamente');
                },
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
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formHeader}>
                    <h2 className={styles.title}>
                        {isEdit ? 'Editar Producto' : 'Subir Nuevo Producto'}
                    </h2>
                    <p className={styles.subtitle}>
                        {isEdit ? `Editando: ${formData.name}` : 'Complete los campos para crear un nuevo producto'}
                    </p>
                </div>

                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle}>Galería del Producto</h3>

                        <div className={styles.methodToggle}>
                            <button
                                type="button"
                                onClick={() => setUploadMethod('upload')}
                                className={getMethodButtonClassName(styles, uploadMethod, 'upload')}
                            >
                                Subir Archivos
                            </button>
                            <button
                                type="button"
                                onClick={() => setUploadMethod('link')}
                                className={getMethodButtonClassName(styles, uploadMethod, 'link')}
                            >
                                Vincular Carpeta
                            </button>
                        </div>
                    </div>

                    {isUploadingImages && <span className={styles.uploadingStatus}><span className={`material-symbols-outlined ${styles.spinningIcon}`}>refresh</span> Subiendo imágenes...</span>}

                    {uploadMethod === 'upload' ? (
                        <div
                            onDragEnter={handleDragEnter}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={getDropzoneClassName(styles, isDragging)}
                        >
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                                className={styles.dropzoneInput}
                            />
                            <div className={styles.dropzoneContent}>
                                <span className={`material-symbols-outlined ${styles.dropzoneIcon}`}>cloud_upload</span>
                                <span className={styles.dropzoneText}>
                                    {isDragging ? 'Suelta aquí' : (formData.name ? 'Arrastra imágenes o haz click para subir' : 'Escribe arriba el nombre del producto primero para poder subir fotos')}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.linkPanel}>
                            <p className={styles.linkDescription}>
                                <strong>¿Ya tienes las fotos en Cloudinary?</strong> Escribe el nombre exacto de la carpeta (o pega la URL de una foto). La carpeta será vinculada y renombrada automáticamente a "productos/{formData.name || '{nombre-del-producto}'}".
                            </p>
                            <div className={styles.linkControls}>
                                <input
                                    type="text"
                                    placeholder="Ej: mobiliario-oficina, o URL..."
                                    value={manualLinkFolder}
                                    onChange={(e) => setManualLinkFolder(e.target.value)}
                                    className={styles.linkInput}
                                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                />
                                <button
                                    type="button"
                                    onClick={handleLinkFolder}
                                    disabled={isLinking || !manualLinkFolder.trim() || !formData.name}
                                    className={styles.linkButton}
                                >
                                    {isLinking ? 'Vinculando...' : 'Vincular y Renombrar'}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className={styles.manualLinks}>
                        <div className={styles.manualLinksHeader}>
                            <span className={`material-symbols-outlined ${styles.manualLinksIcon}`}>link</span>
                            <h4 className={styles.manualLinksTitle}>Enlaces manuales de Cloudinary</h4>
                        </div>

                        <div className={styles.manualLinksGrid}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.compactLabel}>Imagen Principal (URL)</label>
                                <input
                                    type="text"
                                    value={mainImage}
                                    onChange={(e) => setMainImage(e.target.value)}
                                    placeholder="https://res.cloudinary.com/..."
                                    className={styles.textInput}
                                />
                            </div>
                            <div className={styles.fieldGroup}>
                                <label className={styles.compactLabel}>Imagen Hover (URL)</label>
                                <input
                                    type="text"
                                    value={hoverImage}
                                    onChange={(e) => setHoverImage(e.target.value)}
                                    placeholder="https://res.cloudinary.com/..."
                                    className={`${styles.textInput} ${styles.textInputPurpleFocus}`}
                                />
                            </div>
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.compactLabel}>Imágenes del Carrusel (Una por línea o separadas por comas)</label>
                            <textarea
                                value={galleryImages.join('\n')}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const urls = val.split(/[,\n]/).map(u => u.trim()).filter(u => u !== '');
                                    setGalleryImages(urls);
                                }}
                                rows={3}
                                placeholder="Pega aquí todos los enlaces del carrusel..."
                                className={`${styles.textInput} ${styles.textArea}`}
                            />
                        </div>
                    </div>

                    {isUploadingImages && (
                        <div className={styles.uploadNotice}>
                            Subiendo a Cloudinary... por favor, espera.
                        </div>
                    )}

                    {galleryImages.length > 0 && (
                        <div className={styles.galleryGrid}>
                            {galleryImages.map((imgUrl, idx) => {
                                const isMain = mainImage === imgUrl;
                                const isHover = hoverImage === imgUrl;
                                return (
                                    <div key={idx} className={getGalleryItemClassName(styles, isMain)}>
                                        <div className={styles.galleryImageWrapper} onClick={() => autoSaveImages(imgUrl, hoverImage)}>
                                            <img src={imgUrl} alt={`Product ${idx}`} className={styles.galleryImage} />
                                        </div>

                                        <div className={styles.galleryBadges}>
                                            {isMain && <span className={styles.mainBadge}>Principal</span>}
                                            {isHover && <span className={styles.hoverBadge}>Hover</span>}
                                        </div>

                                        <button
                                            type="button"
                                            className={styles.removeImageButton}
                                            onClick={() => {
                                                setGalleryImages((prev) => prev.filter((value) => value !== imgUrl));
                                                if (isMain) setMainImage('');
                                                if (isHover) setHoverImage('');
                                            }}
                                        >
                                            <span className={`material-symbols-outlined ${styles.removeImageIcon}`}>close</span>
                                        </button>

                                        <div className={`${styles.galleryActions} ${!isMain && !isHover ? styles.galleryActionsHidden : ''}`}>
                                            <button
                                                type="button"
                                                onClick={() => autoSaveImages(mainImage, isHover ? '' : imgUrl)}
                                                className={getHoverToggleClassName(styles, isHover)}
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
                        <p className={styles.galleryHint}>
                            Haz clic en una imagen para hacerla <strong className={styles.hintPrimary}>Principal</strong>. Usa el botón inferior para marcarla o desmarcarla como <strong className={styles.hintPurple}>Hover</strong>. Todas las imágenes mostradas formarán parte de la galería del producto.
                        </p>
                    )}
                </div>

                <div className={styles.formGrid}>
                    <div className={styles.fullWidthField}>
                        <label className={styles.label}>Nombre del Producto *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={styles.textInput}
                            required
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>SKU</label>
                        <div className={styles.inlineField}>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                className={styles.textInput}
                            />
                            <button
                                type="button"
                                onClick={() => setFormData(p => ({ ...p, sku: `PRD-${Date.now().toString().slice(-6)}` }))}
                                className={styles.autoButton}
                            >
                                Auto
                            </button>
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Categoría</label>
                        <div className={styles.selectGroup}>
                            <select
                                value={selectedParentId}
                                onChange={(e) => { setSelectedParentId(e.target.value); setSelectedSubId(''); }}
                                className={styles.selectInput}
                            >
                                <option value="">
                                    {isFlatCategoryModel ? '— Seleccionar Categoría —' : '— Seleccionar Padre —'}
                                </option>
                                {parentCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>

                            {!isFlatCategoryModel && subCategories.length > 0 && (
                                <select
                                    value={selectedSubId}
                                    onChange={(e) => setSelectedSubId(e.target.value)}
                                    className={`${styles.selectInput} ${styles.selectInputPrimary}`}
                                >
                                    <option value="">— Seleccionar Subcategoría —</option>
                                    {subCategories.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                                </select>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Descripción</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className={`${styles.textInput} ${styles.textArea}`}
                    />
                </div>

                <div className={styles.formGrid}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Precio Base (€) *</label>
                        <input
                            type="number"
                            name="base_price"
                            value={formData.base_price}
                            onChange={handleChange}
                            step="0.01"
                            className={styles.textInput}
                            required
                        />
                    </div>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Stock</label>
                        <input
                            type="number"
                            name="stock_quantity"
                            value={formData.stock_quantity}
                            onChange={handleChange}
                            className={styles.textInput}
                        />
                    </div>
                </div>

                <div className={styles.checkboxRow}>
                    <label className={styles.checkboxLabel}>
                        <input type="checkbox" name="is_adult_only" checked={formData.is_adult_only} onChange={handleChange} className={styles.checkbox} />
                        <span className={styles.checkboxText}>Solo adultos</span>
                    </label>
                    <label className={styles.checkboxLabel}>
                        <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className={styles.checkbox} />
                        <span className={styles.checkboxText}>Producto Activo</span>
                    </label>
                </div>

                <div className={styles.footerActions}>
                    <button
                        type="button"
                        onClick={onCancel || resetForm}
                        className={styles.secondaryButton}
                    >
                        {isEdit ? 'Cancelar' : 'Limpiar'}
                    </button>
                    <button
                        type="submit"
                        disabled={uploading}
                        className={styles.primaryButton}
                    >
                        {uploading ? 'Guardando...' : (isEdit ? 'Guardar Cambios' : 'Crear Producto')}
                    </button>
                </div>
            </form>
        </div>
    );
}
