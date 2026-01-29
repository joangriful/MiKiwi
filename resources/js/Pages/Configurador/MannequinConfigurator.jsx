import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { Head } from '@inertiajs/react';
import ConfiguradorLayout from '@/Layouts/ConfiguradorLayout';
import MannequinModel from '@/Components/Configurador/MannequinModel';
import ModelErrorBoundary from '@/Components/Configurador/ModelErrorBoundary';

// Demo models showing how to switch. In production, scan the directory or fetch from API.
const availableModels = [
    { id: 'default', name: 'Maniquí Base', path: '/models/mannequin.glb', thumbnail: '/images/mannequin_ref.png' },
    { id: 'variant1', name: 'Variante 1', path: '/models/mannequin_v1.glb', thumbnail: null }, // Placeholder
    { id: 'variant2', name: 'Variante 2', path: '/models/mannequin_v2.glb', thumbnail: null }, // Placeholder
];

function Scene({ customTexture, color, morphs, modelPath }) {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 1, 4]} fov={45} />
            <OrbitControls
                minDistance={2}
                maxDistance={8}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 1.8}
                enableDamping
                target={[0, 1, 0]}
            />

            <ambientLight intensity={0.7} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />

            <Environment preset="city" />

            <group position={[0, 0, 0]}>
                <ModelErrorBoundary key={modelPath}>
                    <MannequinModel
                        modelPath={modelPath}
                        customTexture={customTexture}
                        color={color}
                        morphs={morphs}
                    />
                </ModelErrorBoundary>
                <ContactShadows resolution={1024} scale={10} blur={1} opacity={0.5} far={10} color="#000000" />
            </group>
        </>
    );
}

function Loader() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p>Cargando modelo 3D...</p>
        </div>
    );
}

export default function MannequinConfigurator() {
    const [color, setColor] = useState('#ffffff');
    const [customTexture, setCustomTexture] = useState(null);
    const [selectedModel, setSelectedModel] = useState(availableModels[0]);
    const [morphs, setMorphs] = useState({
        weight: 0,
        muscle: 0
    });

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setCustomTexture(url);
        }
    };

    return (
        <ConfiguradorLayout>
            <Head title="Configurador de Maniquí" />

            <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden bg-gray-50">
                {/* 3D Viewport */}
                <div className="w-full lg:w-3/4 relative h-[60vh] lg:h-full bg-gradient-to-b from-gray-100 to-gray-200">
                    <Suspense fallback={<Loader />}>
                        <Canvas shadows dpr={[1, 2]}>
                            <Scene
                                modelPath={selectedModel.path}
                                customTexture={customTexture}
                                color={color}
                                morphs={morphs}
                            />
                        </Canvas>
                    </Suspense>

                    <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                        <h1 className="text-xl font-bold text-gray-800">Maniquí Personalizable</h1>
                        <p className="text-sm text-gray-600">Sube tus diseños o personaliza el cuerpo</p>
                    </div>
                </div>

                {/* Controls Panel */}
                <div className="w-full lg:w-1/4 bg-white border-l border-gray-200 p-6 overflow-y-auto shadow-lg z-10">
                    <h2 className="text-lg font-bold mb-6 text-gray-800 border-b pb-2">Personalización</h2>

                    {/* Model Selector */}
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Seleccionar Modelo
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {availableModels.map((model) => (
                                <button
                                    key={model.id}
                                    onClick={() => setSelectedModel(model)}
                                    className={`relative rounded-lg overflow-hidden h-20 border-2 transition-all ${selectedModel.id === model.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {model.thumbnail ? (
                                        <img src={model.thumbnail} alt={model.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-medium text-center p-1">
                                            {model.name}
                                        </div>
                                    )}
                                    {selectedModel.id === model.id && (
                                        <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                                            <div className="bg-blue-500 rounded-full p-1">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Texture Upload */}
                    <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Imagen / Textura
                        </label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    <p className="text-sm text-gray-500"><span className="font-semibold">Click para subir</span></p>
                                    <p className="text-xs text-gray-500">PNG, JPG</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>
                        {customTexture && (
                            <div className="mt-4">
                                <p className="text-xs text-gray-500 mb-2">Previsualización:</p>
                                <img src={customTexture} alt="Preview" className="h-20 w-20 object-cover rounded shadow-sm border" />
                                <button
                                    onClick={() => setCustomTexture(null)}
                                    className="text-xs text-red-500 mt-2 hover:underline"
                                >
                                    Eliminar textura
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Color Picker */}
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Color Base
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="h-10 w-full cursor-pointer rounded border border-gray-300"
                            />
                            <span className="text-sm text-gray-500 font-mono">{color}</span>
                        </div>
                    </div>

                    {/* Shape Morphing */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">Forma del cuerpo</h3>

                        <div className="mb-4">
                            <label className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Peso</span>
                                <span>{Math.round(morphs.weight * 100)}%</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={morphs.weight}
                                onChange={(e) => setMorphs({ ...morphs, weight: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Musculatura</span>
                                <span>{Math.round(morphs.muscle * 100)}%</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={morphs.muscle}
                                onChange={(e) => setMorphs({ ...morphs, muscle: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>

                        <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-lg border border-blue-100">
                            <strong>Nota:</strong> Para ver los cambios de forma, asegúrate de que el archivo <code>public/models/mannequin.glb</code> tenga los Shape Keys (morph targets) correspondientes.
                        </div>
                    </div>
                </div>
            </div>
        </ConfiguradorLayout>
    );
}
