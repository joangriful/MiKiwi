import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, useFBX } from '@react-three/drei';
import MannequinModel from './MannequinModel';
import ModelErrorBoundary from './ModelErrorBoundary';
import { availableModels } from './modelsMetadata';

// Preload FBX models only when this 3D component is loaded
availableModels.forEach(model => {
    if (model.path.endsWith('.fbx')) {
        useFBX.preload(model.path);
    }
});

/**
 * MannequinScene3D component
 * 
 * Encapsulates the entire Three.js Canvas and Scene logic for the Mannequin.
 * This component is intended to be loaded via React.lazy.
 */
export default function MannequinScene3D({
    customTexture,
    color,
    bodyParams,
    hairParams,
    modelPath,
    texturePath,
    normalPath,
    modelId,
    rotationY
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

            {/* Visual Helpers */}
            <gridHelper args={[10, 10, '#888888', '#cccccc']} />
            <axesHelper args={[5]} />

            <group position={[0, 0, 0]}>
                <ModelErrorBoundary key={modelPath}>
                    <MannequinModel
                        modelPath={modelPath}
                        texturePath={texturePath}
                        normalPath={normalPath}
                        modelId={modelId}
                        customTexture={customTexture}
                        color={color}
                        bodyParams={bodyParams}
                        hairParams={hairParams}
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
