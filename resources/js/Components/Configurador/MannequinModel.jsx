import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF, useTexture, Center, useFBX } from '@react-three/drei';
import { useGraph, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural Hair Component
const Hair = ({ style, color }) => {
    const material = useMemo(() => new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.5,
        metalness: 0.1
    }), [color]);

    if (style === 'bald') return null;

    return (
        <group position={[0, 1.75, 0]}>
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
    texturePath, // New prop for auto-texture
    customTexture,
    color,
    bodyParams,
    hairParams
}) {
    // Determine file type
    const isFBX = modelPath && modelPath.toLowerCase().endsWith('.fbx');

    // Load Model (FBX or GLB)
    let scene;
    if (isFBX) {
        scene = useFBX(modelPath);
    } else {
        const gltf = useGLTF(modelPath || '/models/mannequin.glb');
        scene = gltf.scene;
    }

    // Auto-load texture if provided
    const autoTexture = useTexture(texturePath || '/images/mannequin_ref.png'); // Fallback to something if missing, but should be provided
    if (texturePath) {
        autoTexture.flipY = true; // FBX textures often need flipY
        autoTexture.encoding = THREE.sRGBEncoding;
    }

    // Custom User Texture (overrides auto)
    const emptyTexture = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    const userTexture = useTexture(customTexture || emptyTexture);
    userTexture.flipY = false;

    // Bone References
    const bones = useRef({});

    useEffect(() => {
        if (!scene) return;

        scene.traverse((object) => {
            if (object.isBone) {
                const name = object.name.toLowerCase();
                // Standard Mixamo/General bone mapping
                if (name.includes('hip') || name.includes('root') || name === 'mixamorig_hips') bones.current.hips = object;
                if ((name.includes('spine') && !name.includes('1') && !name.includes('2')) || name === 'mixamorig_spine') bones.current.spine = object;
                if (name.includes('chest') || name.includes('spine2') || name === 'mixamorig_spine2') bones.current.chest = object;
                if (name.includes('neck') || name === 'mixamorig_neck') bones.current.neck = object;
                if (name.includes('head') || name === 'mixamorig_head') bones.current.head = object;

                if ((name.includes('leg') && name.includes('up') && name.includes('l')) || name === 'mixamorig_leftupleg') bones.current.legL = object;
                if ((name.includes('leg') && name.includes('up') && name.includes('r')) || name === 'mixamorig_rightupleg') bones.current.legR = object;

                if ((name.includes('shoulder') && name.includes('l')) || name === 'mixamorig_leftshoulder') bones.current.shoulderL = object;
                if ((name.includes('shoulder') && name.includes('r')) || name === 'mixamorig_rightshoulder') bones.current.shoulderR = object;
            }

            // Apply textures/colors
            if (object.isMesh) {
                // If custom texture is uploaded by user, use it
                if (customTexture) {
                    object.material.map = userTexture;
                    object.material.color = new THREE.Color(0xffffff); // Reset color to white so texture shows
                    object.material.needsUpdate = true;
                }
                // Else if model has a specific texture defined (auto-texture)
                else if (texturePath) {
                    object.material.map = autoTexture;
                    // Ensure color doesn't tint it weirdly, unless 'color' state is meant to tint the skin
                    // The user asked for "Included texture", so we likely want the texture AS IS.
                    // But we also have a "Skin Color" picker. 
                    // usually if a texture is provided, we might want to multiply the color OR ignore it.
                    // Let's assume for now the texture provides the base look.
                    object.material.color = new THREE.Color(1, 1, 1);
                    object.material.needsUpdate = true;
                }
                // Fallback: Color picker
                else {
                    object.material.color = new THREE.Color(color);
                    object.material.map = null;
                    object.material.needsUpdate = true;
                }
            }
        });
    }, [scene, color, customTexture, userTexture, texturePath, autoTexture]);

    // Apply Transformations
    useFrame(() => {
        if (!scene) return;

        // Reset logic if needed, but for now we apply scale relative to base

        // Hips (Width)
        if (bones.current.hips) {
            // Hips often scale the whole lower body if we aren't careful, but scaling children helps
            // For simple width:
            const width = 1 + (bodyParams.hips * 0.4);
            bones.current.hips.scale.set(width, 1, width);
        }

        // Chest/Bust
        if (bones.current.chest) {
            const scale = 1 + (bodyParams.bust * 0.5);
            bones.current.chest.scale.set(scale, 1, scale * 1.2);
        }

        // Waist (Spine)
        if (bones.current.spine) {
            const width = 1 + (bodyParams.waist * 0.4);
            bones.current.spine.scale.set(width, 1, width);
        }

        // Head
        if (bones.current.head) {
            const size = 1 + (bodyParams.head * 0.5 - 0.25);
            bones.current.head.scale.set(size, size, size);
        }

        // Legs (Length)
        if (bones.current.legL && bones.current.legR) {
            const len = 1 + (bodyParams.legs * 0.3);
            bones.current.legL.scale.y = len;
            bones.current.legR.scale.y = len;
        }

        // Shoulders
        if (bones.current.shoulderL && bones.current.shoulderR) {
            const width = 1 + (bodyParams.shoulders * 0.3);
            bones.current.shoulderL.scale.x = width;
            bones.current.shoulderR.scale.x = width;
        }
    });

    return (
        <Center top>
            <group>
                <primitive
                    object={scene}
                    dispose={null}
                    scale={[
                        0.012, // FBX is often 100x larger (cm vs m), scaling down. Adjust if needed.
                        0.012 * (1 + (bodyParams.height * 0.2)),
                        0.012
                    ]}
                />

                {/* Hair */}
                {hairParams.style !== 'bald' && (
                    <group position={[0, 1.7, 0]} scale={[1, 1 + (bodyParams.height * 0.2), 1]}>
                        <Hair style={hairParams.style} color={hairParams.color} />
                    </group>
                )}
            </group>
        </Center>
    );
}

useGLTF.preload('/models/mannequin_ref.glb');
