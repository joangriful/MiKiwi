import React, { useCallback, useEffect, useId, useState } from 'react';
import Cropper from 'react-easy-crop';
import styles from './ImageEditorModal.module.css';

export default function ImageEditorModal({
    isOpen,
    onClose,
    aspectRatio = 1,
    onSave,
    onError,
    type = 'profile',
    existingImageUrl = null,
}) {
    const fileInputId = useId();
    const [imageUrl, setImageUrl] = useState(existingImageUrl);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [saving, setSaving] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const editorLabel = type === 'banner' ? 'banner' : 'foto de perfil';
    const maxFileSizeLabel = type === 'banner' ? '10 MB' : '5 MB';

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setImageUrl(existingImageUrl);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setCroppedAreaPixels(null);
        setSaving(false);
        setDragActive(false);
    }, [existingImageUrl, isOpen, type]);

    const onCropComplete = useCallback((_, areaPixels) => {
        setCroppedAreaPixels(areaPixels);
    }, []);

    const handleFileSelect = (file) => {
        if (!file) {
            return;
        }

        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
            onError(`Selecciona una imagen en formato JPG o PNG para tu ${editorLabel}.`);
            return;
        }

        const maxSize = type === 'banner' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
        if (file.size > maxSize) {
            onError(`La imagen es demasiado grande. El tamaño máximo para tu ${editorLabel} es de ${maxFileSizeLabel}.`);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDrag = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (event.type === 'dragenter' || event.type === 'dragover') {
            setDragActive(true);
        } else if (event.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);

        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            handleFileSelect(event.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (event) => {
        if (event.target.files && event.target.files[0]) {
            handleFileSelect(event.target.files[0]);
        }

        event.target.value = '';
    };

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getCroppedImg = async (imageSrc, pixelCrop, currentRotation = 0) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const maxSize = Math.max(image.width, image.height);
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

        canvas.width = safeArea;
        canvas.height = safeArea;

        context.translate(safeArea / 2, safeArea / 2);
        context.rotate((currentRotation * Math.PI) / 180);
        context.translate(-safeArea / 2, -safeArea / 2);

        context.drawImage(
            image,
            safeArea / 2 - image.width * 0.5,
            safeArea / 2 - image.height * 0.5,
        );

        const data = context.getImageData(0, 0, safeArea, safeArea);

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        context.putImageData(
            data,
            Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
            Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y),
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.95);
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const croppedBlob = await getCroppedImg(imageUrl, croppedAreaPixels, rotation);
            onSave(croppedBlob);
            handleClose();
        } catch {
            onError(`No pudimos procesar la ${type === 'banner' ? 'imagen del banner' : 'foto de perfil'}. Prueba con otra imagen o vuelve a intentarlo.`);
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

    if (!isOpen) {
        return null;
    }

    return (
        <div className={`${styles.root} ${styles.overlay}`}>
            <div className={styles.dialog}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {type === 'banner' ? 'Editar Banner' : 'Editar Foto de Perfil'}
                    </h2>
                    <button type="button" onClick={handleClose} className={styles.closeButton} aria-label="Cerrar editor de imagen">
                        <span className={styles.materialIcon}>close</span>
                    </button>
                </div>

                {!imageUrl ? (
                    <div className={styles.emptyArea}>
                        <label
                            htmlFor={fileInputId}
                            aria-label="Seleccionar imagen"
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`${styles.dropZone} ${dragActive ? styles.dropZoneActive : styles.dropZoneIdle}`}
                        >
                            <div className={styles.dropZoneContent}>
                                <span className={`${styles.materialIconHero} ${styles.dropZoneIcon}`}>
                                    {dragActive ? 'download' : 'cloud_upload'}
                                </span>
                                <div>
                                    <h3 className={styles.dropZoneTitle}>
                                        {dragActive ? 'Suelta la imagen aquí' : 'Arrastra y suelta tu imagen'}
                                    </h3>
                                    <p className={styles.dropZoneSubtitle}>
                                        o haz click para seleccionar un archivo
                                    </p>
                                </div>
                                <div className={styles.dropZoneMeta}>
                                    <p>Formatos soportados: JPEG, JPG, PNG</p>
                                    <p>Tamaño máximo: {maxFileSizeLabel}</p>
                                </div>
                            </div>
                            <input
                                id={fileInputId}
                                aria-label="Seleccionar imagen"
                                type="file"
                                onChange={handleFileInput}
                                accept="image/jpeg,image/jpg,image/png"
                                className={styles.hiddenInput}
                            />
                        </label>
                    </div>
                ) : (
                    <>
                        <div className={styles.cropperArea}>
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
                                showGrid
                                cropShape={type === 'profile' ? 'round' : 'rect'}
                            />
                        </div>

                        <div className={styles.controlsPanel}>
                            <div className={styles.controlGroup}>
                                <label htmlFor="image-editor-zoom" className={styles.controlLabel}>
                                    <span className={styles.materialIcon}>zoom_in</span>
                                    Zoom: {zoom.toFixed(1)}x
                                </label>
                                <input
                                    id="image-editor-zoom"
                                    aria-label="Zoom de imagen"
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    value={zoom}
                                    onChange={(event) => setZoom(parseFloat(event.target.value))}
                                    className={styles.slider}
                                />
                            </div>

                            <div className={styles.controlGroup}>
                                <span className={styles.controlLabel}>
                                    <span className={styles.materialIcon}>rotate_right</span>
                                    Rotación: {rotation}°
                                </span>
                                <div className={styles.rotationActions}>
                                    <button type="button" onClick={() => setRotation((value) => value - 90)} className={styles.ghostAction}>
                                        <span className={styles.materialIcon}>rotate_left</span>
                                        -90°
                                    </button>
                                    <button type="button" onClick={() => setRotation(0)} className={styles.ghostAction}>
                                        Reset
                                    </button>
                                    <button type="button" onClick={() => setRotation((value) => value + 90)} className={styles.ghostAction}>
                                        <span className={styles.materialIcon}>rotate_right</span>
                                        +90°
                                    </button>
                                </div>
                            </div>

                            <div className={styles.footerActions}>
                                <button type="button" onClick={() => setImageUrl(null)} className={styles.neutralAction}>
                                    Cambiar Imagen
                                </button>
                                <button type="button" onClick={handleClose} disabled={saving} className={styles.cancelAction}>
                                    Cancelar
                                </button>
                                <button type="button" onClick={handleSave} disabled={saving} className={styles.primaryAction}>
                                    {saving ? (
                                        <>
                                            <span className={`${styles.materialIcon} ${styles.spin}`}>refresh</span>
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <span className={styles.materialIcon}>check</span>
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
