import React, { useState, useEffect, Suspense, lazy } from 'react';
import styles from './Mannequin3DViewer.module.css';

// Lazy load the 3D scene component
const MannequinScene3D = lazy(() => import('./components/MannequinScene3D'));

const availableModels = [
    {
        id: 'naked_queen',
        name: 'Queen',
        path: '/models/naked-queen/source/NakedQueen.fbx',
        texturePath: '/models/naked-queen/textures/NakedQueen.jpeg',
        thumbnail: null,
        rotationY: 0
    },
    {
        id: 'naked_woman_standing',
        name: 'Standing',
        path: '/models/naked-woman-standing/source/Nake-Sum_Wom_RtStand_875.fbx',
        texturePath: '/models/naked-woman-standing/textures/Nake-Sum_Wom_RtStand_diffuse_875.png',
        normalPath: '/models/naked-woman-standing/textures/Nake-Sum_Wom_RtStand_normal_875.png',
        thumbnail: null,
        rotationY: Math.PI
    },
    {
        id: 'naked_woman_walk',
        name: 'Walking',
        path: '/models/naked-woman-walk/source/Nake-Sum_Wom_RtWalk_854.fbx',
        texturePath: '/models/naked-woman-walk/textures/Nake-Sum_Wom_RtWalk_diffuse_854.png',
        normalPath: '/models/naked-woman-walk/textures/Nake-Sum_Wom_RtWalk_normal_854.png',
        thumbnail: null,
        rotationY: 0
    },
    {
        id: 'witch_naked',
        name: 'Witch',
        path: '/models/witch-naked/source/Yennefer_Naked_med.fbx',
        texturePath: '/models/witch-naked/textures/Yennefer_Naked_med.jpeg',
        thumbnail: null,
        rotationY: 0
    },
];


function Loader() {
    return (
        <div className={styles.loader}>
            <div className={styles.spinner} />
            <p className={styles.loaderText}>Cargando modelo 3D...</p>
        </div>
    );
}

export default function Mannequin3DViewer({ onModelMounted, isActive = false }) {
    const [selectedModel, setSelectedModel] = useState(availableModels[0]);
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

    const handleModelMounted = () => {
        setIsModelReady(true);
        if (onModelMounted) onModelMounted();
    };

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
                        {availableModels.map((model) => (
                            <button
                                key={model.id}
                                onClick={() => setSelectedModel(model)}
                                className={[
                                    styles.modelButton,
                                    selectedModel.id === model.id
                                        ? styles.modelButtonActive
                                        : '',
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                            >
                                {model.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
