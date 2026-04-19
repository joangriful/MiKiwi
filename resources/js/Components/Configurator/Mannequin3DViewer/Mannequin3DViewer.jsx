import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei/core/OrbitControls';
import { PerspectiveCamera } from '@react-three/drei/core/PerspectiveCamera';
import { Environment } from '@react-three/drei/core/Environment';
import { ContactShadows } from '@react-three/drei/core/ContactShadows';
import MannequinModel from '../MannequinModel/MannequinModel';
import ModelErrorBoundary from '@/Components/Configurator/ModelErrorBoundary/ModelErrorBoundary';
import styles from './Mannequin3DViewer.module.css';

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

function Scene({ modelPath, texturePath, normalPath, modelId, rotationY, color, bodyParams }) {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 1.5, 4]} fov={50} />
            <OrbitControls
                minDistance={1}
                maxDistance={10}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 1.7}
                enableDamping
                target={[0, 1, 0]}
            />

            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
            <directionalLight position={[-5, 5, -5]} intensity={0.5} />

            <Environment preset="studio" />

            <group position={[0, 0, 0]}>
                <ModelErrorBoundary key={modelPath}>
                    <MannequinModel
                        modelPath={modelPath}
                        texturePath={texturePath}
                        normalPath={normalPath}
                        modelId={modelId}
                        color={color}
                        bodyParams={bodyParams}
                        rotationY={rotationY}
                    />
                </ModelErrorBoundary>
                <ContactShadows
                    resolution={1024}
                    scale={10}
                    blur={2}
                    opacity={0.4}
                    far={10}
                    color="#000000"
                    position={[0, 0.01, 0]}
                />
            </group>
        </>
    );
}

function Loader() {
    return (
        <div className={styles.loader}>
            <div className={styles.spinner}></div>
            <p className={styles.loaderText}>Cargando modelo 3D...</p>
        </div>
    );
}

export default function Mannequin3DViewer() {
    const [selectedModel, setSelectedModel] = useState(availableModels[0]);
    const [bodyParams, setBodyParams] = useState({
        height: 0.5,
        bust: 0.5,
        hips: 0.5,
        waist: 0.5,
        legs: 0.5,
        shoulders: 0.5,
        head: 0.5
    });

    const updateBodyParam = (key, value) => {
        setBodyParams(prev => ({ ...prev, [key]: parseFloat(value) }));
    };

    return (
        <div className={styles.root}>
            <div className={styles.viewportArea}>
                <Suspense fallback={<Loader />}>
                    <Canvas shadows dpr={[1, 2]}>
                        <Scene
                            modelPath={selectedModel.path}
                            texturePath={selectedModel.texturePath}
                            normalPath={selectedModel.normalPath}
                            modelId={selectedModel.id}
                            rotationY={selectedModel.rotationY || 0}
                            color="#ffd5b4"
                            bodyParams={bodyParams}
                        />
                    </Canvas>
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
