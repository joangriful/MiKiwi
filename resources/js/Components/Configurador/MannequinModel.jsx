import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { useGraph, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural Hair Component
const Hair = ({ style, color, headBone }) => {
    // We attach hair to the head bone if possible, otherwise we follow head position.
    // For simplicity in this demo, we'll just render it relative to the model's head position approximation.
    // In a real rigged model, you'd parent this mesh to the Head bone.

    const material = useMemo(() => new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.5,
        metalness: 0.1
    }), [color]);

    if (style === 'bald') return null;

    return (
        <group position={[0, 1.75, 0]}> {/* Approximate head position offset */}
            {style === 'short' && (
                <mesh material={material} position={[0, 0, -0.02]}>
                    <sphereGeometry args={[0.16, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                </mesh>
            )}
            {style === 'medium' && (
                <group>
                    <mesh material={material} position={[0, 0, -0.02]}>
                        <sphereGeometry args={[0.17, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
                    </mesh>
                    <mesh material={material} position={[0, -0.15, -0.1]}>
                        <cylinderGeometry args={[0.17, 0.2, 0.3, 32, 1, true]} />
                    </mesh>
                </group>
            )}
            {style === 'long' && (
                <group>
                    <mesh material={material} position={[0, 0, -0.02]}>
                        <sphereGeometry args={[0.17, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
                    </mesh>
                    <mesh material={material} position={[0, -0.3, -0.1]}>
                        <cylinderGeometry args={[0.17, 0.25, 0.8, 32, 1, true]} />
                    </mesh>
                </group>
            )}
            {style === 'updo' && (
                <group>
                    <mesh material={material} position={[0, 0, -0.02]}>
                        <sphereGeometry args={[0.16, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
                    </mesh>
                    <mesh material={material} position={[0, 0.15, -0.1]}>
                        <sphereGeometry args={[0.12, 32, 32]} />
                    </mesh>
                </group>
            )}
        </group>
    );
};

export default function MannequinModel({
    modelPath,
    customTexture,
    color,
    bodyParams,
    hairParams
}) {
    // Load model
    const path = modelPath || '/models/mannequin.glb';
    const { scene } = useGLTF(path);
    const { nodes } = useGraph(scene);

    // Custom Texture
    const emptyTexture = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    const userTexture = useTexture(customTexture || emptyTexture);
    userTexture.flipY = false;

    // Bone References (We try to find standard names)
    const bones = useRef({});

    useEffect(() => {
        // Map bones
        scene.traverse((object) => {
            if (object.isBone) {
                const name = object.name.toLowerCase();
                if (name.includes('hip') || name.includes('root')) bones.current.hips = object;
                if (name.includes('spine') && !name.includes('1') && !name.includes('2')) bones.current.spine = object;
                if (name.includes('chest') || name.includes('spine2')) bones.current.chest = object;
                if (name.includes('neck')) bones.current.neck = object;
                if (name.includes('head')) bones.current.head = object;

                if (name.includes('leg') && name.includes('up') && name.includes('l')) bones.current.legL = object;
                if (name.includes('leg') && name.includes('up') && name.includes('r')) bones.current.legR = object;

                if (name.includes('shoulder') && name.includes('l')) bones.current.shoulderL = object;
                if (name.includes('shoulder') && name.includes('r')) bones.current.shoulderR = object;
            }

            // Apply materials
            if (object.isMesh) {
                if (object.material) {
                    object.material.color = new THREE.Color(color);
                    object.material.needsUpdate = true;

                    if (customTexture) {
                        object.material.map = userTexture;
                        object.material.map.encoding = THREE.sRGBEncoding;
                        object.material.needsUpdate = true;
                    } else {
                        object.material.map = null;
                        object.material.needsUpdate = true;
                    }
                }
            }
        });
    }, [scene, color, customTexture, userTexture]);

    // Apply Transformations every frame for smooth transitions
    useFrame(() => {
        // Height (Scale root/hips Y)
        if (bones.current.hips) {
            // Base scale 1. Hips usually control overall height if root is static
            // Or we scale the whole Scene group
        }

        // We'll scale the whole scene for Height to keep it simple and consistent

        // Chest/Bust (Scale Chest Bone X/Z)
        if (bones.current.chest) {
            const scale = 1 + (bodyParams.bust * 0.5); // 0 to 1 range mapped to 1.0 to 1.5
            bones.current.chest.scale.set(scale, 1, scale * 1.2); // Z often depth
        }

        // Hips/Glutes (Scale Hips X/Z)
        if (bones.current.hips) {
            const width = 1 + (bodyParams.hips * 0.4);
            bones.current.hips.scale.set(width, 1, width);
        }

        // Waist (Spine Width)
        if (bones.current.spine) {
            const width = 1 + (bodyParams.waist * 0.4);
            bones.current.spine.scale.set(width, 1, width);
        }

        // Head Size
        if (bones.current.head) {
            const size = 1 + (bodyParams.head * 0.5 - 0.25); // +/- range
            bones.current.head.scale.set(size, size, size);
        }

        // Legs (LengthY)
        if (bones.current.legL && bones.current.legR) {
            const len = 1 + (bodyParams.legs * 0.3);
            bones.current.legL.scale.y = len;
            bones.current.legR.scale.y = len;
        }

        // Shoulders (Scale X)
        if (bones.current.shoulderL && bones.current.shoulderR) {
            const width = 1 + (bodyParams.shoulders * 0.3);
            bones.current.shoulderL.scale.x = width; // Local axis might vary
            bones.current.shoulderR.scale.x = width;
        }
    });

    return (
        <group>
            {/* Body */}
            <primitive
                object={scene}
                dispose={null}
                position={[0, -1, 0]}
                scale={[
                    1,
                    1 + (bodyParams.height * 0.2), // Global Height scaling 
                    1
                ]}
            />

            {/* Hair */}
            <group position={[0, -1, 0]} scale={[1, 1 + (bodyParams.height * 0.2), 1]}>
                <Hair style={hairParams.style} color={hairParams.color} />
            </group>
        </group>
    );
}

useGLTF.preload('/models/mannequin_ref.glb');
