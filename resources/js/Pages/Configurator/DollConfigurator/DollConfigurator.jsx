import React, { useState, Suspense, lazy } from 'react';
import { Head } from '@inertiajs/react';
import ConfiguratorLayout from '@/Layouts/ConfiguratorLayout';
import CustomizationPanel from '@/Components/Configurator/CustomizationPanel/CustomizationPanel';
import styles from './DollConfigurator.module.css';

// Lazy load the 3D scene to defer Three.js bundle download
const DollScene3D = lazy(() => import('./components/DollScene3D'));


function Loading() {
    return (
        <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p>Cargando configurador...</p>
        </div>
    );
}

export default function DollConfigurator() {
    // State for customization options
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

    return (
        <ConfiguratorLayout>
            <Head title="Configurador de Muñecas - MiKiwi" />

            <div className={`${styles.root} configurator-container`}>
                {/* 3D Canvas */}
                <div className="canvas-container">
                    <Suspense fallback={<Loading />}>
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
                    </Suspense>

                    {/* Branding overlay */}
                    <div className="brand-overlay">
                        <h1 className="brand-title">Configurador de Muñecas</h1>
                        <p className="brand-subtitle">MIKIWI Collection</p>
                    </div>
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
                />
            </div>
        </ConfiguratorLayout>
    );
}
