import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { Head } from '@inertiajs/react';
import ConfiguradorLayout from '@/Layouts/ConfiguradorLayout';
import MannequinModel from '@/Components/Configurador/MannequinModel';
import ModelErrorBoundary from '@/Components/Configurador/ModelErrorBoundary';

const availableModels = [
    {
        id: 'naked_queen',
        name: 'Naked Queen',
        path: '/models/naked-queen/source/NakedQueen.fbx',
        texturePath: '/models/naked-queen/textures/NakedQueen.jpeg',
        thumbnail: null
    },
    { id: 'chloe_toy_3', name: 'Chloe', path: '/models/chloe_toy_3.glb', thumbnail: null },
    { id: 'witch_naked', name: 'Witch', path: '/models/witch_naked.glb', thumbnail: null },
];

const hairStyles = [
    { id: 'bald', name: 'Sin Pelo' },
    { id: 'short', name: 'Corto' },
    { id: 'medium', name: 'Medio' },
    { id: 'long', name: 'Largo' },
    { id: 'updo', name: 'Recogido' },
];

const hairColors = [
    { id: '#1a1a1a', name: 'Negro' },
    { id: '#5d4037', name: 'Castaño' },
    { id: '#e6c793', name: 'Rubio' },
    { id: '#b7410e', name: 'Pelirrojo' },
    { id: '#ea80fc', name: 'Fantasía' },
];

function Scene({ customTexture, color, bodyParams, hairParams, modelPath, texturePath }) {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 1, 3.5]} fov={50} />
            <OrbitControls
                minDistance={1.5}
                maxDistance={6}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 1.8}
                enableDamping
                target={[0, 1, 0]}
            />

            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1.0} castShadow />
            <directionalLight position={[-5, 3, -5]} intensity={0.4} />

            <Environment preset="studio" />

            <group position={[0, 0, 0]}>
                <ModelErrorBoundary key={modelPath}>
                    <MannequinModel
                        modelPath={modelPath}
                        texturePath={texturePath}
                        customTexture={customTexture}
                        color={color}
                        bodyParams={bodyParams}
                        hairParams={hairParams}
                    />
                </ModelErrorBoundary>
                <ContactShadows resolution={1024} scale={10} blur={1} opacity={0.4} far={10} color="#000000" />
            </group>
        </>
    );
}

function Loader() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p>Cargando modelo...</p>
        </div>
    );
}

export default function MannequinConfigurator() {
    const [color, setColor] = useState('#ffd5b4');
    const [customTexture, setCustomTexture] = useState(null);
    const [selectedModel, setSelectedModel] = useState(availableModels[0]);
    const [activeTab, setActiveTab] = useState('chicas'); // Default to CHICAS as requested or keep logic

    // Body Parameters (0 to 1 range, default 0.5 for neutral unless specified)
    const defaultBodyParams = {
        height: 0.5,
        bust: 0.5,
        hips: 0.5,
        waist: 0.5,
        legs: 0.5,
        shoulders: 0.5,
        head: 0.5
    };
    const [bodyParams, setBodyParams] = useState(defaultBodyParams);

    // Hair Parameters
    const [hairParams, setHairParams] = useState({
        style: 'bald',
        color: '#5d4037'
    });

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setCustomTexture(url);
        }
    };

    const updateBodyParam = (key, value) => {
        setBodyParams(prev => ({ ...prev, [key]: parseFloat(value) }));
    };

    return (
        <ConfiguradorLayout>
            <Head title="Configurador de Maniquí Avanzado" />

            <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden bg-gray-50">
                {/* 3D Viewport */}
                <div className="w-full lg:w-3/4 relative h-[50vh] lg:h-full bg-gradient-to-b from-gray-200 to-gray-300">
                    <Suspense fallback={<Loader />}>
                        <Canvas shadows dpr={[1, 2]}>
                            <Scene
                                modelPath={selectedModel.path}
                                texturePath={selectedModel.texturePath}
                                customTexture={customTexture}
                                color={color}
                                bodyParams={bodyParams}
                                hairParams={hairParams}
                            />
                        </Canvas>
                    </Suspense>

                    <div className="absolute top-4 left-4 pointer-events-none">
                        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100">
                            <h1 className="text-xl font-bold text-gray-800">Estudio de Diseño</h1>
                            <p className="text-sm text-gray-600">Configuración Avanzada 3D</p>
                        </div>
                    </div>

                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
                        <button
                            onClick={() => {
                                setBodyParams(defaultBodyParams);
                                setColor('#ffd5b4');
                                setHairParams({ style: 'medium', color: '#5d4037' });
                            }}
                            className="px-4 py-2 bg-white/80 hover:bg-white text-gray-700 rounded-full shadow-md text-sm font-medium transition-all backdrop-blur-sm"
                        >
                            Resetear Valores
                        </button>
                    </div>
                </div>

                {/* Controls Panel */}
                <div className="w-full lg:w-1/4 bg-white border-l border-gray-200 overflow-hidden flex flex-col shadow-2xl z-10">

                    {/* Tabs Header */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('chicas')}
                            className={`flex-1 py-4 text-sm font-bold tracking-wider uppercase transition-colors ${activeTab === 'chicas'
                                ? 'bg-white text-pink-600 border-b-2 border-pink-600'
                                : 'bg-gray-50 text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            CHICAS
                        </button>
                        <button
                            onClick={() => setActiveTab('personalizar')}
                            className={`flex-1 py-4 text-sm font-bold tracking-wider uppercase transition-colors ${activeTab === 'personalizar'
                                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                                : 'bg-gray-50 text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            PERSONALIZAR
                        </button>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">

                        {/* Tab: CHICAS */}
                        {activeTab === 'chicas' && (
                            <div className="animate-fade-in">
                                <p className="text-xs text-gray-500 mb-4 text-center">
                                    Selecciona un modelo base para comenzar tu diseño.
                                </p>
                                <div className="grid grid-cols-3 gap-3">
                                    {availableModels.map((model) => (
                                        <button
                                            key={model.id}
                                            onClick={() => setSelectedModel(model)}
                                            className={`relative group rounded-xl overflow-hidden aspect-square border-2 transition-all shadow-sm ${selectedModel.id === model.id ? 'border-pink-500 ring-2 ring-pink-200' : 'border-gray-200 hover:border-pink-300'
                                                }`}
                                        >
                                            {model.thumbnail ? (
                                                <img src={model.thumbnail} alt={model.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-1">
                                                    <span className="text-[10px] uppercase font-bold text-gray-400 text-center leading-tight">
                                                        {model.name}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Selected Indicator */}
                                            {selectedModel.id === model.id && (
                                                <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center backdrop-blur-[1px]">
                                                    <div className="bg-pink-500 rounded-full p-1 shadow-md">
                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tab: PERSONALIZAR */}
                        {activeTab === 'personalizar' && (
                            <div className="space-y-8 animate-fade-in">

                                {/* 1. Body Dimensions */}
                                <div>
                                    <h3 className="flex items-center text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">
                                        <span className="bg-blue-100 text-blue-600 p-1 rounded mr-2">1</span>
                                        Dimensiones
                                    </h3>
                                    <div className="space-y-5">
                                        {[
                                            { id: 'height', label: 'Altura Total' },
                                            { id: 'bust', label: 'Pecho / Busto' },
                                            { id: 'waist', label: 'Anchura Cintura' },
                                            { id: 'hips', label: 'Cadera / Glúteos' },
                                            { id: 'legs', label: 'Longitud Piernas' },
                                            { id: 'shoulders', label: 'Ancho Hombros' },
                                            { id: 'head', label: 'Tamaño Cabeza' },
                                        ].map((p) => (
                                            <div key={p.id}>
                                                <div className="flex justify-between mb-1">
                                                    <label className="text-xs font-semibold text-gray-600">{p.label}</label>
                                                    <span className="text-xs text-gray-400 font-mono">{Math.round(bodyParams[p.id] * 100)}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.01"
                                                    value={bodyParams[p.id]}
                                                    onChange={(e) => updateBodyParam(p.id, e.target.value)}
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. Skin & Hair */}
                                <div>
                                    <h3 className="flex items-center text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">
                                        <span className="bg-purple-100 text-purple-600 p-1 rounded mr-2">2</span>
                                        Estilo
                                    </h3>

                                    {/* Skin Color */}
                                    <div className="mb-6">
                                        <label className="block text-xs font-semibold text-gray-600 mb-2">Tono de Piel</label>
                                        <div className="flex gap-2 flex-wrap">
                                            {['#ffd5b4', '#d4aa7d', '#8d5524', '#c68642', '#3e2723', '#ffecb3'].map((c) => (
                                                <button
                                                    key={c}
                                                    onClick={() => setColor(c)}
                                                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-blue-500 scale-110' : 'border-gray-200'}`}
                                                    style={{ backgroundColor: c }}
                                                />
                                            ))}
                                            <input
                                                type="color"
                                                value={color}
                                                onChange={(e) => setColor(e.target.value)}
                                                className="w-8 h-8 p-0 rounded-full border-0 overflow-hidden cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    {/* Hair Style */}
                                    <div className="mb-6">
                                        <label className="block text-xs font-semibold text-gray-600 mb-2">Estilo de Pelo</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {hairStyles.map((h) => (
                                                <button
                                                    key={h.id}
                                                    onClick={() => setHairParams({ ...hairParams, style: h.id })}
                                                    className={`px-2 py-2 text-xs rounded-md border transition-all ${hairParams.style === h.id
                                                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium'
                                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {h.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Hair Color */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-2">Color de Pelo</label>
                                        <div className="flex gap-2 flex-wrap">
                                            {hairColors.map((hc) => (
                                                <button
                                                    key={hc.id}
                                                    onClick={() => setHairParams({ ...hairParams, color: hc.id })}
                                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${hairParams.color === hc.id ? 'border-blue-500 scale-110' : 'border-transparent'}`}
                                                    style={{ backgroundColor: hc.id }}
                                                    title={hc.name}
                                                />
                                            ))}
                                            <input
                                                type="color"
                                                value={hairParams.color}
                                                onChange={(e) => setHairParams({ ...hairParams, color: e.target.value })}
                                                className="w-6 h-6 p-0 rounded-full border-0 overflow-hidden cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Texture & Model */}
                                <div>
                                    <h3 className="flex items-center text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">
                                        <span className="bg-emerald-100 text-emerald-600 p-1 rounded mr-2">3</span>
                                        Material
                                    </h3>

                                    {/* Texture Upload */}
                                    <div className="mb-4">
                                        <label className="block text-xs font-semibold text-gray-600 mb-2">
                                            Textura Personalizada
                                        </label>
                                        <label className="flex items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors bg-white">
                                            <div className="text-center">
                                                <p className="text-xs text-gray-500">Subir Imagen</p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                        {customTexture && (
                                            <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded">
                                                <span className="text-xs text-gray-600">Textura activa</span>
                                                <button
                                                    onClick={() => setCustomTexture(null)}
                                                    className="text-xs text-red-500 hover:underline"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ConfiguradorLayout>
    );
}
