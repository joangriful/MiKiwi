import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import MannequinModel from './MannequinModel';
import ModelErrorBoundary from '@/Components/Configurador/ModelErrorBoundary';

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
                <div className="absolute top-4 right-4 flex flex-col gap-2 max-w-[120px]">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white/80 backdrop-blur-sm p-2 rounded-lg text-center shadow-sm">
                        Modelos
                    </p>
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px] p-1">
                        {availableModels.map((model) => (
                            <button
                                key={model.id}
                                onClick={() => setSelectedModel(model)}
                                className={`group p-2 rounded-xl transition-all border-2 text-center h-16 flex items-center justify-center font-bold text-[10px] uppercase tracking-tighter ${selectedModel.id === model.id
                                        ? 'bg-black text-white border-black shadow-lg scale-105'
                                        : 'bg-white text-gray-400 border-white hover:border-gray-200'
                                    }`}
                            >
                                {model.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Controls Side Panel */}
            <div className="w-full lg:w-80 bg-white border-l border-gray-100 flex flex-col shadow-xl z-10 overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-1">Anatomía</h2>
                    <p className="text-[10px] text-gray-500 font-medium">Ajusta las proporciones del maniquí</p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {Object.entries(bodyParams).map(([key, value]) => (
                        <div key={key} className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                    {key === 'height' ? 'Altura' :
                                        key === 'bust' ? 'Busto' :
                                            key === 'hips' ? 'Caderas' :
                                                key === 'waist' ? 'Cintura' :
                                                    key === 'legs' ? 'Piernas' :
                                                        key === 'shoulders' ? 'Hombros' :
                                                            key === 'head' ? 'Cabeza' : key}
                                </label>
                                <span className="text-[10px] font-mono font-bold text-black bg-gray-100 px-1.5 py-0.5 rounded">
                                    {Math.round(value * 100)}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={value}
                                onChange={(e) => updateBodyParam(key, e.target.value)}
                                className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black"
                            />
                        </div>
                    ))}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <button
                        onClick={() => setBodyParams({ height: 0.5, bust: 0.5, hips: 0.5, waist: 0.5, legs: 0.5, shoulders: 0.5, head: 0.5 })}
                        className="w-full py-3 bg-white border border-gray-200 text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-colors shadow-sm"
                    >
                        Resetear Anatomía
                    </button>
                </div>
            </div>
        </div>
    );
}
