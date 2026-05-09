import React, { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import Toast from '@/Components/Toast/Toast';
import { extractImageFiles } from '@/Utils/imageFiles';
import styles from './HeroImageManager.module.css';

function UploadStatus({ uploading }) {
    if (uploading) {
        return (
            <div className={styles.uploadStatus}>
                <div className={styles.spinner} />
                <p className={styles.uploadStatusText}>Subiendo...</p>
            </div>
        );
    }

    return (
        <div className={styles.uploadStatus}>
            <span className={styles.plusIcon}>+</span>
            <p className={styles.uploadStatusText}>Añadir imagen</p>
        </div>
    );
}

function ImageCard({ image, onDelete }) {
    return (
        <div className={styles.imageCard}>
            <img
                src={image.url}
                alt={image.public_id}
                className={styles.image}
            />
            <div className={styles.imageOverlay}>
                <button
                    type="button"
                    onClick={() => window.open(image.url, '_blank')}
                    className={styles.overlayButton}
                    title="Ver imagen"
                >
                    <span className={`material-symbols-outlined ${styles.overlayButtonIcon}`}>visibility</span>
                </button>
                <button
                    type="button"
                    onClick={() => onDelete(image.id)}
                    className={`${styles.overlayButton} ${styles.overlayButtonDanger}`}
                    title="Eliminar imagen"
                >
                    <span className={`material-symbols-outlined ${styles.overlayButtonIcon}`}>delete</span>
                </button>
            </div>
        </div>
    );
}

function getUploadCardClassName(isDragging) {
    return `${styles.uploadCard} ${isDragging ? styles.uploadCardDragging : ''}`;
}

export default function HeroImageManager({
    images = [],
    title = 'Imágenes del Hero',
    description = 'Gestiona las imágenes de fondo del hero principal',
    uploadType = 'home',
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

        const imageFiles = extractImageFiles(e.dataTransfer.files);

        if (imageFiles.length > 0) {
            uploadImages(imageFiles);
        } else {
            setToast({ message: 'Solo se permiten archivos de imagen', type: 'error' });
        }
    };

    const handleFileSelect = (e) => {
        uploadImages(extractImageFiles(e.target.files));
    };

    const handleUploadCardKeyDown = (e) => {
        if (uploading || (e.key !== 'Enter' && e.key !== ' ')) {
            return;
        }

        e.preventDefault();
        fileInputRef.current?.click();
    };

    const uploadImages = (files) => {
        setUploading(true);
        const formData = new FormData();
        files.forEach((file) => formData.append('images[]', file));
        formData.append('type', uploadType);

        router.post(route('content.hero.upload'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setToast({ message: `${files.length} imagen(es) subida(s) correctamente`, type: 'success' });
                setUploading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
            onError: () => {
                setToast({ message: 'Error al subir las imágenes', type: 'error' });
                setUploading(false);
            },
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
                },
            });
        }
    };

    const uploadCardClassName = getUploadCardClassName(isDragging);

    return (
        <div className={styles.container}>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className={styles.header}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
            </div>

            <div className={styles.grid}>
                <div
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={uploadCardClassName}
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    onKeyDown={handleUploadCardKeyDown}
                    role="button"
                    tabIndex={uploading ? -1 : 0}
                    aria-label="Subir imagen del hero"
                >
                    <div className={styles.uploadCardContent}>
                        <UploadStatus uploading={uploading} />
                    </div>
                    <input
                        ref={fileInputRef}
                        aria-label="Seleccionar imagen del hero"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className={styles.fileInput}
                        disabled={uploading}
                    />
                </div>

                {images.map((image) => (
                    <ImageCard key={image.id} image={image} onDelete={handleDelete} />
                ))}
            </div>
        </div>
    );
}
