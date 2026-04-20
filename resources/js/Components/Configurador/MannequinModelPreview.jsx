import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import MannequinModel from './MannequinModel';
import ModelErrorBoundary from './ModelErrorBoundary';

function Scene() {
    return (
        <>
            <OrbitControls minDistance={2} maxDistance={5} autoRotate />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
            <Environment preset="city" />

            <ModelErrorBoundary>
                <MannequinModel
                    color="#ffffff"
                    morphs={{ weight: 0.5, muscle: 0.5 }}
                />
            </ModelErrorBoundary>
            <ContactShadows resolution={512} scale={10} blur={1} opacity={0.5} far={10} color="#000000" />
        </>
    );
}

export default function MannequinModelPreview() {
    return (
        <div style={{ width: '100%', height: '500px', background: '#f0f0f0', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ padding: '10px', background: '#e0e0e0', fontSize: '12px', color: '#666' }}>
                Preview Wrapper (Canvas + Lights)
            </div>
            <Suspense fallback={<div className="flex items-center justify-center h-full">Loading 3D Scene...</div>}>
                <Canvas shadows camera={{ position: [0, 1, 3], fov: 45 }}>
                    <Scene />
                </Canvas>
            </Suspense>
        </div>
    );
}
