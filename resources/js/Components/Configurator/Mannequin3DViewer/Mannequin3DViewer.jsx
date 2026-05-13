import React, { useState, useEffect, Suspense, lazy } from 'react';
import { loadMannequinScene3D } from '@/Components/Configurator/utils/lazyLoaders';
import { DEFAULT_READY_DOLL_MODELS } from '@/Components/Configurator/utils/readyDollModels';
import styles from './Mannequin3DViewer.module.css';

// Lazy load the 3D scene component
const MannequinScene3D = lazy(loadMannequinScene3D);


function Loader() {
    return (
        <div className={styles.loader}>
            <div className={styles.spinner} />
            <p className={styles.loaderText}>Cargando modelo 3D...</p>
        </div>
    );
}

function resolveInitialModel(models, productSlug) {
    if (!productSlug) {
        return models[0];
    }

    return models.find((model) => model.productSlug === productSlug) || models[0];
}

export default function Mannequin3DViewer({
    onModelMounted,
    isActive = false,
    onBuyDoll,
    onAddDollToCart,
    isBuyingDoll = false,
    isAddingDollToCart = false,
    addedDollSlug = null,
    readyDollModels = DEFAULT_READY_DOLL_MODELS,
    initialProductSlug = null,
}) {
    const currentReadyDollModels = readyDollModels.length > 0
        ? readyDollModels
        : DEFAULT_READY_DOLL_MODELS;
    const [selectedModel, setSelectedModel] = useState(() => resolveInitialModel(currentReadyDollModels, initialProductSlug));
    const [isModelReady, setIsModelReady] = useState(false);
    const [bodyParams] = useState({
        height: 0.5,
        bust: 0.5,
        hips: 0.5,
        waist: 0.5,
        legs: 0.5,
        shoulders: 0.5,
        head: 0.5
    });

    // Reset ready state when model changes to show loader during transitions
    useEffect(() => {
        setIsModelReady(false);
    }, [selectedModel.id]);

    useEffect(() => {
        setSelectedModel((currentModel) => (
            currentReadyDollModels.find((model) => model.productSlug === initialProductSlug)
            || currentReadyDollModels.find((model) => model.id === currentModel.id)
            || currentReadyDollModels[0]
        ));
    }, [currentReadyDollModels, initialProductSlug]);

    const handleModelMounted = () => {
        setIsModelReady(true);
        if (onModelMounted) onModelMounted();
    };

    const selectedProductSlug = selectedModel.productSlug;
    const canBuySelectedDoll = Boolean(selectedProductSlug);
    const isSelectedDollAdded = addedDollSlug === selectedProductSlug;
    const isSubmittingDollAction = isBuyingDoll || isAddingDollToCart;

    return (
        <div className={styles.root}>
            <div className={styles.viewportArea}>
                {/* Persistent Loader Overlay: Visible until ModelContent signals completion */}
                {(!isModelReady && isActive) && <Loader />}

                <Suspense fallback={<Loader />}>
                    <MannequinScene3D
                        modelPath={selectedModel.path}
                        texturePath={selectedModel.texturePath}
                        normalPath={selectedModel.normalPath}
                        modelId={selectedModel.id}
                        rotationY={selectedModel.rotationY || 0}
                        color="#ffd5b4"
                        bodyParams={bodyParams}
                        onModelMounted={handleModelMounted}
                        isActive={isActive}
                    />
                </Suspense>

                <div className={styles.selectorOverlay}>
                    <p className={styles.selectorTitle}>
                        Modelos
                    </p>
                    <div className={styles.selectorList}>
                        {currentReadyDollModels.map((model) => (
                            <button
                                key={model.id}
                                type="button"
                                onClick={() => setSelectedModel(model)}
                                className={[
                                    styles.modelButton,
                                    selectedModel.id === model.id
                                        ? styles.modelButtonActive
                                        : '',
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                                aria-pressed={selectedModel.id === model.id}
                                aria-label={`Seleccionar modelo ${model.name}`}
                            >
                                {model.name}
                            </button>
                        ))}
                    </div>
                </div>

                {canBuySelectedDoll ? (
                    <div className={styles.purchaseOverlay}>
                        <div>
                            <p className={styles.purchaseTitle}>{selectedModel.name}</p>
                            {isSelectedDollAdded ? (
                                <p className={styles.purchaseStatus}>Añadida al carrito</p>
                            ) : null}
                        </div>

                        <div className={styles.purchaseActions}>
                            <button
                                type="button"
                                onClick={() => onAddDollToCart?.(selectedProductSlug)}
                                className={`${styles.purchaseButton} ${styles.purchaseButtonSecondary}`}
                                disabled={isSubmittingDollAction}
                            >
                                {isAddingDollToCart ? 'Añadiendo...' : 'Añadir al carrito'}
                            </button>
                            <button
                                type="button"
                                onClick={() => onBuyDoll?.(selectedProductSlug)}
                                className={styles.purchaseButton}
                                disabled={isSubmittingDollAction}
                            >
                                {isBuyingDoll ? 'Procesando...' : 'Comprar'}
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
