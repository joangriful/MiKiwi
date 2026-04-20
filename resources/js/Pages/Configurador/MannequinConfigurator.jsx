import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Head } from '@inertiajs/react';
import ConfiguradorLayout from '@/Layouts/ConfiguradorLayout';
import SegmentedDoll2D from '@/Components/Configurador/SegmentedDoll2D';
import BodyPartSelector from '@/Components/Configurador/BodyPartSelector';
import { availableModels } from '@/Components/Configurador/modelsMetadata';

// Lazy load the 3D scene to defer loading of Three.js and heavy dependencies
const MannequinScene3D = lazy(() => import('@/Components/Configurador/MannequinScene3D'));



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
    const [activeTab, setActiveTab] = useState('personalizar'); // Default to PERSONALIZAR tab

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

    const [hairParams, setHairParams] = useState({
        style: 'bald',
        color: '#5d4037'
    });

    // Part library and selection state
    const [partLibrary, setPartLibrary] = useState(null);
    const [selectedParts, setSelectedParts] = useState({
        head: null,
        torso: null,
        armLeft: null,
        armRight: null,
        legLeft: null,
        legRight: null
    });

    // Load part library on mount
    useEffect(() => {
        fetch('/data/partLibrary.json')
            .then(response => response.json())
            .then(data => {
                setPartLibrary(data);
                // Start with no parts selected as per user request ("poco a poco")
                setSelectedParts({
                    head: null,
                    torso: null,
                    armLeft: null,
                    armRight: null,
                    legLeft: null,
                    legRight: null
                });
            })
            .catch(error => {
                console.error('Failed to load part library:', error);
            });
    }, []);

    // Handle part selection
    const handlePartSelect = (partType, part) => {
        setSelectedParts(prev => {
            const newParts = { ...prev, [partType]: part };

            // Automatic pairing for limbs (Arms and Legs)
            // If user selects a left limb, auto-select the right limb from the same doll if available, and vice versa.
            const pairingMap = {
                'armLeft': 'armRight',
                'armRight': 'armLeft',
                'legLeft': 'legRight',
                'legRight': 'legLeft'
            };

            const pairedType = pairingMap[partType];
            if (pairedType && partLibrary) {
                // Find the same doll in the library to get the corresponding part
                const currentDoll = partLibrary.dolls.find(d => d.id === part.dollId);
                if (currentDoll && currentDoll.parts[pairedType]) {
                    newParts[pairedType] = {
                        ...currentDoll.parts[pairedType],
                        dollId: currentDoll.id,
                        dollName: currentDoll.name,
                        partType: pairedType
                    };
                }
            }

            return newParts;
        });
    };

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
                {/* 3D/2D Viewport */}
                <div className="w-full lg:w-3/4 relative h-[50vh] lg:h-full bg-gradient-to-b from-gray-200 to-gray-300">
                    <Suspense fallback={<Loader />}>
                        {activeTab === 'chicas' ? (
                            <MannequinScene3D
                                modelPath={selectedModel.path}
                                texturePath={selectedModel.texturePath}
                                normalPath={selectedModel.normalPath}
                                modelId={selectedModel.id}
                                rotationY={selectedModel.rotationY || 0}
                                customTexture={customTexture}
                                color={color}
                                bodyParams={bodyParams}
                                hairParams={hairParams}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center animate-fade-in" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                <div className="w-full h-full p-4 lg:p-12">
                                    <SegmentedDoll2D
                                        selectedParts={selectedParts}
                                        bodyProportions={{
                                            height: bodyParams.height,
                                            bust: bodyParams.bust,
                                            waist: bodyParams.waist,
                                            hips: bodyParams.hips
                                        }}
                                        canvasWidth={800}
                                        canvasHeight={1000}
                                        showGuides={false}
                                    />
                                </div>
                            </div>
                        )}
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
                                setHairParams({ style: 'bald', color: '#5d4037' });
                                setSelectedParts({
                                    head: 'doll-2', bust: 'doll-2', arms: 'doll-2',
                                    torso: 'doll-2', pelvis: 'doll-2', legs: 'doll-2',
                                    hair: 'none', eyes: 'none'
                                });
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
                            className={`flex-1 py-4 text-[10px] font-bold tracking-widest uppercase transition-colors ${activeTab === 'chicas'
                                ? 'bg-white text-pink-600 border-b-2 border-pink-600'
                                : 'bg-gray-50 text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            CHICAS
                        </button>
                        <button
                            onClick={() => setActiveTab('personalizar')}
                            className={`flex-1 py-4 text-[10px] font-bold tracking-widest uppercase transition-colors ${activeTab === 'personalizar'
                                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                                : 'bg-gray-50 text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            PERSONALIZAR
                        </button>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">

                        {/* Tab: CHICAS (Model Selection) */}
                        {activeTab === 'chicas' && (
                            <div className="animate-fade-in">
                                <p className="text-[10px] text-gray-400 mb-6 text-center uppercase tracking-widest">
                                    Modelo 3D Base
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    {availableModels.map((model) => (
                                        <button
                                            key={model.id}
                                            onClick={() => setSelectedModel(model)}
                                            className={`relative group rounded-xl overflow-hidden aspect-square border transition-all ${selectedModel.id === model.id ? 'border-pink-500 ring-4 ring-pink-50' : 'border-gray-100 hover:border-pink-200'
                                                }`}
                                        >
                                            {model.thumbnail ? (
                                                <img src={model.thumbnail} alt={model.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-2 text-center">
                                                    <span className="text-[10px] uppercase font-bold text-gray-400">
                                                        {model.name}
                                                    </span>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tab: PERSONALIZAR (Collage System) */}
                        {activeTab === 'personalizar' && (
                            <div className="animate-fade-in">
                                {partLibrary ? (
                                    <BodyPartSelector
                                        selectedParts={selectedParts}
                                        onPartSelect={handlePartSelect}
                                        partLibrary={partLibrary}
                                    />
                                ) : (
                                    <div className="text-center py-20">
                                        <div className="w-10 h-10 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Cargando Estudio...</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ConfiguradorLayout>
    );
}
