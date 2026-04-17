import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import MannequinModel from '../MannequinModel/MannequinModel';
import ModelErrorBoundary from '@/Components/Configurator/ModelErrorBoundary/ModelErrorBoundary';

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
        <div className="flex flex-col items-center justify-center w-full h-full bg-white">
            <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium font-outfit">Cargando modelo 3D...</p>
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
        <div className="flex flex-col lg:flex-row w-full h-full overflow-hidden bg-gray-50">
            {/* Viewport Area */}
            <div className="flex-1 relative bg-gradient-to-b from-gray-100 to-gray-200">
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

                {/* Overlay Model Selector */}
                <div className="absolute top-4 right-4 flex flex-col gap-3 max-w-[140px] z-50">
                    <p className="text-[12px] font-bold text-gray-800 uppercase tracking-widest bg-white/90 backdrop-blur-sm p-3 rounded-xl text-center shadow-lg border border-white/20">
                        Modelos
                    </p>
                    <div className="flex flex-col gap-3 overflow-y-auto max-h-[70vh] p-1 scrollbar-hide">
                        {availableModels.map((model) => (
                            <button
                                key={model.id}
                                onClick={() => setSelectedModel(model)}
                                className={`group p-4 rounded-2xl transition-all border-2 text-center h-24 flex items-center justify-center font-bold text-xs uppercase tracking-tight ${selectedModel.id === model.id
                                    ? 'bg-black text-white border-black shadow-2xl scale-105 z-10'
                                    : 'bg-white/80 backdrop-blur-md text-gray-600 border-white hover:border-black/10 hover:bg-white shadow-sm'
                                    }`}
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
