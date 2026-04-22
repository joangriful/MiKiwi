import React, { useRef, useEffect, useMemo, useState, Suspense } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { 
    MeshStandardMaterial, 
    NoColorSpace, 
    SRGBColorSpace, 
    Vector3, 
    Box3, 
    DoubleSide 
} from 'three';

// Procedural Hair Component
const Hair = ({ style, color }) => {
    const material = useMemo(() => new MeshStandardMaterial({
        color: color || '#000000',
        roughness: 0.8,
        metalness: 0.1
    }), [color]);

    if (!style || style === 'bald') return null;

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

/**
 * ModelContent: Performs heavy FBX parsing and texture loading.
 */
function ModelContent({ 
    modelPath, texturePath, normalPath, modelId, customTexture, color, bodyParams = {}, hairParams = {}, rotationY,
    onModelMounted
}) {
    const loadStart = useRef(performance.now());
    const onModelMountedRef = useRef(onModelMounted);

    useEffect(() => {
        onModelMountedRef.current = onModelMounted;
    }, [onModelMounted]);
    
    // 1. Load Model
    const fbx = useLoader(FBXLoader, modelPath, (loader) => {
        loader.setResourcePath('');
    });

    // 2. Load Textures
    const emptyPix = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    const autoTexture = useTexture(texturePath || emptyPix);
    const normalTexture = useTexture(normalPath || emptyPix);
    const userTexture = useTexture(customTexture || emptyPix);

    useEffect(() => {
        const texStart = performance.now();
        [autoTexture, normalTexture, userTexture].forEach(t => {
            if (t && t.image) {
                t.flipY = true;
                t.colorSpace = t === normalTexture ? NoColorSpace : SRGBColorSpace;
                t.needsUpdate = true;
            }
        });
        const duration = Math.round(performance.now() - texStart);
        if (duration > 5) {
            console.warn(`%c[3D GPU] %cPreparación de texturas completada en %c${duration}ms`, "color: #E91E63; font-weight: bold", "color: #666", "color: #E91E63; font-weight: bold");
        }
    }, [autoTexture, normalTexture, userTexture]);

    const bones = useRef({});
    const [normScale, setNormScale] = useState(1);
    const [offset, setOffset] = useState(new Vector3(0, 0, 0));

    useEffect(() => {
        if (!fbx) return;
        fbx.scale.set(1, 1, 1);
        fbx.position.set(0, 0, 0);
        fbx.rotation.set(0, rotationY, 0);
        fbx.updateMatrixWorld(true);

        const box = new Box3().setFromObject(fbx);
        const center = new Vector3();
        box.getCenter(center);
        const h = box.max.y - box.min.y;
        if (h > 0.1) {
            setNormScale(1.75 / h);
            setOffset(new Vector3(-center.x, -box.min.y, -center.z));
        }

        fbx.traverse(obj => {
            obj.frustumCulled = false;
            if (obj.isBone) {
                const name = obj.name.toLowerCase();
                if (name.includes('hip') || name === 'mixamorig_hips') bones.current.hips = obj;
                if ((name.includes('spine') && !name.includes('1') && !name.includes('2')) || name === 'mixamorig_spine') bones.current.spine = obj;
                if (name.includes('chest') || name === 'mixamorig_spine2') bones.current.chest = obj;
                if (name.includes('head') || name === 'mixamorig_head') bones.current.head = obj;
                if (name.includes('leg') && name.includes('up') && name.includes('l')) bones.current.legL = obj;
                if (name.includes('leg') && name.includes('up') && name.includes('r')) bones.current.legR = obj;
                if (name.includes('shoulder') && name.includes('l')) bones.current.shoulderL = obj;
                if (name.includes('shoulder') && name.includes('r')) bones.current.shoulderR = obj;
            }
            
            if (obj.isMesh) {
                obj.visible = true;
                const replaceMat = (m) => {
                    const n = new MeshStandardMaterial({ side: DoubleSide, roughness: 0.6, metalness: 0.05 });
                    if (m && m.color) n.color.copy(m.color);
                    return n;
                };
                obj.material = Array.isArray(obj.material) ? obj.material.map(m => replaceMat(m)) : replaceMat(obj.material);
                
                const name = obj.name.toLowerCase();
                if (name.includes('plane') || name.includes('floor')) obj.visible = false;
            }
        });

        // Ensure 3D Ready Log (User request)
        const end = performance.now();
        console.warn(`%c[3D Model] %cModelo ${modelId} montado con éxito en %c${Math.round(end - loadStart.current)}ms`, "color: #4CAF50; font-weight: bold", "color: #666", "color: #4CAF50");

        if (onModelMountedRef.current) {
            onModelMountedRef.current();
        }

        return () => {
            fbx.traverse(obj => {
                if (obj.isMesh) {
                    if (obj.geometry) obj.geometry.dispose();
                    if (obj.material) {
                        (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(m => m.dispose());
                    }
                }
            });
        };
    }, [fbx, modelId, rotationY]);

    useEffect(() => {
        if (!fbx) return;
        fbx.traverse(obj => {
            if (obj.isMesh && obj.material) {
                (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(m => {
                    if (customTexture) { m.map = userTexture; m.color.set('#ffffff'); }
                    else if (texturePath && autoTexture?.image) { 
                        m.map = autoTexture; m.color.set('#ffffff'); 
                        if (normalPath && normalTexture?.image) { m.normalMap = normalTexture; m.normalScale.set(1, 1); }
                    } else { m.color.set(color); m.map = null; }
                    m.needsUpdate = true;
                });
            }
        });
    }, [fbx, color, customTexture, userTexture, texturePath, autoTexture, normalPath, normalTexture]);

    useFrame(() => {
        if (!fbx) return;
        const bp = bodyParams;
        if (bones.current.hips) bones.current.hips.scale.set(1 + (bp.hips - 0.5) * 0.8, 1, 1 + (bp.hips - 0.5) * 0.8);
        if (bones.current.chest) bones.current.chest.scale.set(1 + (bp.bust - 0.5) * 1, 1, 1 + (bp.bust - 0.5) * 1);
        if (bones.current.spine) bones.current.spine.scale.set(1 + (bp.waist - 0.5) * 0.8, 1, 1 + (bp.waist - 0.5) * 0.8);
        if (bones.current.head) { const s = 1 + (bp.head - 0.5) * 0.5; bones.current.head.scale.set(s, s, s); }
        if (bones.current.legL && bones.current.legR) { const l = 1 + (bp.legs - 0.5) * 0.6; bones.current.legL.scale.y = l; bones.current.legR.scale.y = l; }
        if (bones.current.shoulderL && bones.current.shoulderR) { const w = 1 + (bp.shoulders - 0.5) * 0.6; bones.current.shoulderL.scale.x = w; bones.current.shoulderR.scale.x = w; }
    });

    const scaledHeight = 1 + (bodyParams.height - 0.5) * 0.4;

    return (
        <group scale={[normScale, normScale * scaledHeight, normScale]}>
            <primitive object={fbx} position={offset} dispose={null} />
            {hairParams?.style && hairParams.style !== 'bald' && <Hair style={hairParams.style} color={hairParams.color} />}
        </group>
    );
}

export default function MannequinModel(props) {
    // Component only mounts when the orchestrator (DollConfigTest) decides it's safe (Idle or Tab Switch)
    return (
        <Suspense fallback={null}>
            <ModelContent {...props} />
        </Suspense>
    );
}
