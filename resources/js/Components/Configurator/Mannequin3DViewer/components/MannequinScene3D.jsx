import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import MannequinModel from '../../MannequinModel/MannequinModel';
import ModelErrorBoundary from '@/Components/Configurator/ModelErrorBoundary/ModelErrorBoundary';

/**
 * MannequinScene3D
 * 
 * Componente que encapsula la escena 3D y el Canvas para el Mannequin3DViewer.
 * Diseñado para ser cargado mediante React.lazy().
 */
export default function MannequinScene3D({ 
    modelPath, 
    texturePath, 
    normalPath, 
    modelId, 
    rotationY, 
    color, 
    bodyParams 
}) {
    return (
        <Canvas shadows dpr={[1, 2]}>
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
        </Canvas>
    );
}
