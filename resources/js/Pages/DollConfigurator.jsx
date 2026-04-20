import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Head } from '@inertiajs/react';
import ConfiguradorLayout from '@/Layouts/ConfiguradorLayout';
import SegmentedDoll2D from '@/Components/Configurador/SegmentedDoll2D';
import CustomizationPanel from '@/Components/Configurador/CustomizationPanel';
import '../../css/doll-configurator.css';

// Lazy load the 3D scene to ensure Three.js is only loaded when 3D mode is activated
const DollScene3D = lazy(() => import('@/Components/Configurador/DollScene3D'));


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
                            <DollScene3D
                                hairStyle={hairStyle}
                                hairColor={hairColor}
                                eyeColor={eyeColor}
                                eyeSize={eyeSize}
                                skinTone={skinTone}
                                bodyProportions={bodyProportions}
                            />
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
