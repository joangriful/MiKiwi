import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Head } from '@inertiajs/react';
import ConfiguradorLayout from '@/Layouts/ConfiguradorLayout';
import DollModel from '@/Components/Configurador/DollModel';
import SegmentedDoll2D from '@/Components/Configurador/SegmentedDoll2D';
import CustomizationPanel from '@/Components/Configurador/CustomizationPanel';
import '../../css/doll-configurator.css';

function Scene({ hairStyle, hairColor, eyeColor, eyeSize, skinTone, bodyProportions }) {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0.5, 3.5]} fov={50} />
            <OrbitControls
                enablePan={false}
                minDistance={2}
                maxDistance={6}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.8}
                enableDamping
                dampingFactor={0.05}
            />

            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight
                position={[5, 5, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />
            <directionalLight position={[-5, 3, -5]} intensity={0.4} />
            <spotLight position={[0, 5, 0]} intensity={0.3} angle={0.6} penumbra={1} />

            {/* Environment for reflections */}
            <Environment preset="studio" />

            {/* Doll Model */}
            <DollModel
                hairStyle={hairStyle}
                hairColor={hairColor}
                eyeColor={eyeColor}
                eyeSize={eyeSize}
                skinTone={skinTone}
                bodyProportions={bodyProportions}
            />

            {/* Ground */}
            <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
                <planeGeometry args={[10, 10]} />
                <shadowMaterial opacity={0.2} />
            </mesh>

            {/* Background gradient circle */}
            <mesh position={[0, 0, -3]}>
                <circleGeometry args={[4, 64]} />
                <meshBasicMaterial color="#f8f9fa" />
            </mesh>
        </>
    );
}

function Loading() {
    return (
        <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p>Cargando configurador...</p>
        </div>
    );
}

export default function DollConfigurator() {
    // Existing state for customization options
    const [hairStyle, setHairStyle] = useState('long');
    const [hairColor, setHairColor] = useState('#8b4513');
    const [eyeColor, setEyeColor] = useState('#3498db');
    const [eyeSize, setEyeSize] = useState(1);
    const [skinTone, setSkinTone] = useState('#ffd5b4');
    const [bodyProportions, setBodyProportions] = useState({
        height: 1,
        bust: 1,
        waist: 1,
        hips: 1,
    });

    // New state for part selection
    const [viewMode, setViewMode] = useState('2d'); // '3d' or '2d' - Default to 2D for part customization
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
                // Set default parts from first doll
                if (data.dolls && data.dolls.length > 0) {
                    const defaultDoll = data.dolls[0];
                    const defaultParts = {};
                    Object.keys(defaultDoll.parts).forEach(partType => {
                        defaultParts[partType] = {
                            ...defaultDoll.parts[partType],
                            dollId: defaultDoll.id,
                            dollName: defaultDoll.name,
                            partType: partType
                        };
                    });
                    setSelectedParts(defaultParts);
                    setViewMode('2d'); // Switch to 2D view when using parts
                }
            })
            .catch(error => {
                console.error('Failed to load part library:', error);
            });
    }, []);

    // Handle part selection
    const handlePartSelect = (partType, partData) => {
        setSelectedParts(prev => ({
            ...prev,
            [partType]: partData
        }));
        // Switch to 2D view when selecting parts
        if (viewMode !== '2d') {
            setViewMode('2d');
        }
    };

    return (
        <ConfiguradorLayout>
            <Head title="Configurador de Muñecas - MiKiwi" />

            <div className="configurator-container">
                {/* 3D/2D Canvas */}
                <div className="canvas-container">
                    {viewMode === '3d' ? (
                        <Suspense fallback={<Loading />}>
                            <Canvas shadows>
                                <Scene
                                    hairStyle={hairStyle}
                                    hairColor={hairColor}
                                    eyeColor={eyeColor}
                                    eyeSize={eyeSize}
                                    skinTone={skinTone}
                                    bodyProportions={bodyProportions}
                                />
                            </Canvas>
                        </Suspense>
                    ) : (
                        <div className="segmented-doll-container" style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '40px'
                        }}>
                            <SegmentedDoll2D
                                selectedParts={selectedParts}
                                bodyProportions={bodyProportions}
                                canvasWidth={800}
                                canvasHeight={1000}
                                showGuides={false}
                            />
                        </div>
                    )}

                    {/* Branding overlay */}
                    <div className="brand-overlay">
                        <h1 className="brand-title">Configurador de Muñecas</h1>
                        <p className="brand-subtitle">MIKIWI Collection</p>
                    </div>

                    {/* View Toggle Button */}
                    <button
                        className="view-toggle-button"
                        onClick={() => setViewMode(viewMode === '3d' ? '2d' : '3d')}
                        style={{
                            position: 'absolute',
                            bottom: '40px',
                            left: '40px',
                            padding: '12px 24px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '2px solid rgba(102, 126, 234, 0.5)',
                            borderRadius: '8px',
                            fontFamily: 'Mulish, sans-serif',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            color: '#667eea',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            zIndex: 10
                        }}
                    >
                        {viewMode === '3d' ? '2D Personalizar' : '3D Modelo'}
                    </button>
                </div>

                {/* Customization Panel */}
                <CustomizationPanel
                    hairStyle={hairStyle}
                    setHairStyle={setHairStyle}
                    hairColor={hairColor}
                    setHairColor={setHairColor}
                    eyeColor={eyeColor}
                    setEyeColor={setEyeColor}
                    eyeSize={eyeSize}
                    setEyeSize={setEyeSize}
                    skinTone={skinTone}
                    setSkinTone={setSkinTone}
                    bodyProportions={bodyProportions}
                    setBodyProportions={setBodyProportions}
                    selectedParts={selectedParts}
                    onPartSelect={handlePartSelect}
                    partLibrary={partLibrary}
                />
            </div>
        </ConfiguradorLayout>
    );
}
