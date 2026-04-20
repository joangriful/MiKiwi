import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import DollModel from '@/Components/Configurator/DollModel/DollModel';

/**
 * DollScene3D 
 * 
 * Componente que encapsula la escena de Three.js para el DollConfigurator.
 * Diseñado para ser cargado mediante React.lazy().
 */
export default function DollScene3D({ 
    hairStyle, 
    hairColor, 
    eyeColor, 
    eyeSize, 
    skinTone, 
    bodyProportions 
}) {
    return (
        <Canvas shadows>
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
        </Canvas>
    );
}
