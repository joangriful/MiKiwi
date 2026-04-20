import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';

// Procedural Hair Component (Stable)
const Hair = ({ style, color }) => {
    const material = useMemo(() => new THREE.MeshStandardMaterial({
        color: color || '#000000',
        roughness: 0.8,
        metalness: 0.1
    }), [color]);

    if (style === 'bald') return null;

    // Standard head height for our 1.75m model is approx 1.62-1.65
    return (
        <group position={[0, 1.63, -0.01]}>
            {style === 'short' && (
                <mesh material={material}>
                    <sphereGeometry args={[0.11, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                </mesh>
            )}
            {style === 'medium' && (
                <group>
                    <mesh material={material}>
                        <sphereGeometry args={[0.12, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
                    </mesh>
                    <mesh material={material} position={[0, -0.1, -0.04]}>
                        <cylinderGeometry args={[0.12, 0.14, 0.2, 32, 1, true]} />
                    </mesh>
                </group>
            )}
            {style === 'long' && (
                <group>
                    <mesh material={material}>
                        <sphereGeometry args={[0.12, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
                    </mesh>
                    <mesh material={material} position={[0, -0.25, -0.04]}>
                        <cylinderGeometry args={[0.12, 0.16, 0.5, 32, 1, true]} />
                    </mesh>
                </group>
            )}
            {style === 'updo' && (
                <group>
                    <mesh material={material}>
                        <sphereGeometry args={[0.11, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
                    </mesh>
                    <mesh material={material} position={[0, 0.1, -0.04]}>
                        <sphereGeometry args={[0.08, 32, 32]} />
                    </mesh>
                </group>
            )}
        </group>
    );
};

export default function MannequinModel({
    modelPath,
    texturePath,
    normalPath,
    modelId,
    customTexture,
    color,
    bodyParams = {},
    hairParams = {},
    rotationY = 0
}) {
    const loadStart = useRef(performance.now());
    
    useEffect(() => {
        loadStart.current = performance.now();
        console.log(`%c[3D Model] %cIniciando carga de geometría: ${modelPath}`, "color: #FF9800; font-weight: bold", "color: #666");
    }, [modelPath]);

    // 1. Load Model (Using useLoader for better resource control)
    const fbx = useLoader(FBXLoader, modelPath, (loader) => {
        loader.setResourcePath('');
    });

    useEffect(() => {
        if (fbx) {
            const end = performance.now();
            console.log(`%c[3D Model] %cGeometría lista: ${modelPath} (%c${Math.round(end - loadStart.current)}ms%c)`, "color: #4CAF50; font-weight: bold", "color: #666", "color: #4CAF50", "color: #666");
        }
    }, [fbx, modelPath]);

    // 2. Load Textures
    const emptyPix = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    const autoTexture = useTexture(texturePath || emptyPix);
    const normalTexture = useTexture(normalPath || emptyPix);
    const userTexture = useTexture(customTexture || emptyPix);

    useEffect(() => {
        [autoTexture, normalTexture, userTexture].forEach(t => {
            if (t && t.image) {
                t.flipY = true;
                if (t === normalTexture) {
                    t.colorSpace = THREE.NoColorSpace;
                } else {
                    t.colorSpace = THREE.SRGBColorSpace;
                }
                t.needsUpdate = true;
            }
        });
    }, [autoTexture, normalTexture, userTexture]);

    // 3. State & Refs
    const bones = useRef({});
    const [normScale, setNormScale] = useState(1);
    const [offset, setOffset] = useState(new THREE.Vector3(0, 0, 0));

    // 4. Setup Model Geometry & Materials
    useEffect(() => {
        if (!fbx) return;

        // A. Reset & Rotate first
        fbx.scale.set(1, 1, 1);
        fbx.position.set(0, 0, 0);
        fbx.rotation.set(0, rotationY, 0);
        fbx.updateMatrixWorld(true);

        // B. Measure rotated geometry for precise centering
        const box = new THREE.Box3().setFromObject(fbx);
        const center = new THREE.Vector3();
        box.getCenter(center);

        const h = box.max.y - box.min.y;
        if (h > 0.1) {
            setNormScale(1.75 / h);
            setOffset(new THREE.Vector3(-center.x, -box.min.y, -center.z));
        }

        // C. Clean up meshes and materials
        fbx.traverse(obj => {
            obj.frustumCulled = false;
            if (obj.isMesh) {
                obj.visible = true;
                // Standardize materials
                const replaceMat = (m) => {
                    const n = new THREE.MeshStandardMaterial({
                        side: THREE.DoubleSide,
                        roughness: 0.6,
                        metalness: 0.05
                    });
                    if (m && m.color) n.color.copy(m.color);
                    return n;
                };

                if (Array.isArray(obj.material)) {
                    obj.material = obj.material.map(m => replaceMat(m));
                } else {
                    obj.material = replaceMat(obj.material);
                }

                // Hide artifacts
                const name = obj.name.toLowerCase();
                if (name.includes('plane') || name.includes('floor') || name.includes('ground') || name.includes('shadow')) {
                    obj.visible = false;
                }
            }

            if (obj.isBone) {
                const name = obj.name.toLowerCase();
                if (name.includes('hip') || name.includes('root') || name === 'mixamorig_hips') bones.current.hips = obj;
                if ((name.includes('spine') && !name.includes('1') && !name.includes('2')) || name === 'mixamorig_spine') bones.current.spine = obj;
                if (name.includes('chest') || name.includes('spine2') || name === 'mixamorig_spine2') bones.current.chest = obj;
                if (name.includes('neck') || name === 'mixamorig_neck') bones.current.neck = obj;
                if (name.includes('head') || name === 'mixamorig_head') bones.current.head = obj;
                if ((name.includes('leg') && name.includes('up') && name.includes('l')) || name === 'mixamorig_leftupleg') bones.current.legL = obj;
                if ((name.includes('leg') && name.includes('up') && name.includes('r')) || name === 'mixamorig_rightupleg') bones.current.legR = obj;
                if ((name.includes('shoulder') && name.includes('l')) || name === 'mixamorig_leftshoulder') bones.current.shoulderL = obj;
                if ((name.includes('shoulder') && name.includes('r')) || name === 'mixamorig_rightshoulder') bones.current.shoulderR = obj;
            }
        });
    }, [fbx, modelId, rotationY]);

    // 5. Apply Textures & Colors Reactively
    useEffect(() => {
        if (!fbx) return;
        fbx.traverse(obj => {
            if (obj.isMesh && obj.material) {
                const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
                mats.forEach(m => {
                    if (customTexture) {
                        m.map = userTexture;
                        m.color.set('#ffffff');
                        m.normalMap = null;
                    } else if (texturePath && autoTexture && autoTexture.image) {
                        m.map = autoTexture;
                        m.color.set('#ffffff');
                        if (normalPath && normalTexture && normalTexture.image) {
                            m.normalMap = normalTexture;
                            m.normalScale.set(1, 1);
                        } else {
                            m.normalMap = null;
                        }
                    } else {
                        m.color.set(color);
                        m.map = null;
                        m.normalMap = null;
                    }
                    m.needsUpdate = true;
                });
            }
        });
    }, [fbx, color, customTexture, userTexture, texturePath, autoTexture, normalPath, normalTexture]);

    // 6. Body Shape Animations
    useFrame(() => {
        if (!fbx) return;
        const bp = bodyParams;
        if (bones.current.hips) bones.current.hips.scale.set(1 + (bp.hips - 0.5) * 0.8, 1, 1 + (bp.hips - 0.5) * 0.8);
        if (bones.current.chest) bones.current.chest.scale.set(1 + (bp.bust - 0.5) * 1, 1, 1 + (bp.bust - 0.5) * 1);
        if (bones.current.spine) bones.current.spine.scale.set(1 + (bp.waist - 0.5) * 0.8, 1, 1 + (bp.waist - 0.5) * 0.8);
        if (bones.current.head) {
            const s = 1 + (bp.head - 0.5) * 0.5;
            bones.current.head.scale.set(s, s, s);
        }
        if (bones.current.legL && bones.current.legR) {
            const l = 1 + (bp.legs - 0.5) * 0.6;
            bones.current.legL.scale.y = l;
            bones.current.legR.scale.y = l;
        }
        if (bones.current.shoulderL && bones.current.shoulderR) {
            const w = 1 + (bp.shoulders - 0.5) * 0.6;
            bones.current.shoulderL.scale.x = w;
            bones.current.shoulderR.scale.x = w;
        }
    });

    const scaledHeight = 1 + (bodyParams.height - 0.5) * 0.4;
    const finalScaleX = normScale;
    const finalScaleY = normScale * scaledHeight;
    const finalScaleZ = normScale;

    return (
        <group scale={[finalScaleX, finalScaleY, finalScaleZ]}>
            <primitive object={fbx} position={offset} dispose={null} />
            {hairParams.style !== 'bald' && (
                <Hair style={hairParams.style} color={hairParams.color} />
            )}
        </group>
    );
}
