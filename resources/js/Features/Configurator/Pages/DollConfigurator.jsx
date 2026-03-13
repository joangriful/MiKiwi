import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Head } from '@inertiajs/react';
import ConfiguradorLayout from '@/Layouts/ConfiguradorLayout';
import DollModel from '@/Features/Configurator/Components/Configurador/DollModel';
import CustomizationPanel from '@/Features/Configurator/Components/Configurador/CustomizationPanel';
import './doll-configurator.css';

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
                <meshBasicMaterial color="#f8f5f0" />
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
        <ConfiguradorLayout>
            <Head title="Configurador de Muñecas - MiKiwi" />

            <div className="configurator-container">
                {/* 3D Canvas */}
                <div className="canvas-container">
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
        </ConfiguradorLayout>
    );
}
