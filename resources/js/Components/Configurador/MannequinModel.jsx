import React, { useEffect, useMemo, useState } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { useGraph } from '@react-three/fiber';
import * as THREE from 'three';

export default function MannequinModel({ customTexture, color, morphs, modelPath }) {
    // Attempt to load the model. Ensure you have a 'mannequin.glb' in public/models/
    // If you don't have one, this will fail.
    // For this demonstration, we'll try to load it, but we can't create the file from nothing.

    const { scene } = useGLTF(modelPath || '/models/mannequin.glb');
    const { nodes, materials } = useGraph(scene);

    // Load custom texture if provided
    const emptyTexture = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    const userTexture = useTexture(customTexture || emptyTexture);
    userTexture.flipY = false;

    // Apply changes to the scene
    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                // Apply Color
                if (child.material) {
                    child.material.color = new THREE.Color(color);
                    child.material.needsUpdate = true;

                    // Apply Texture if available
                    if (customTexture) {
                        child.material.map = userTexture;
                        child.material.map.encoding = THREE.sRGBEncoding;
                        child.material.needsUpdate = true;
                    } else {
                        // Reset map if no texture
                        child.material.map = null;
                        child.material.needsUpdate = true;
                    }
                }

                // Apply Morph Targets (Shape Keys)
                if (child.morphTargetInfluences && child.morphTargetDictionary) {
                    // Example mapping: assumes the model has morph targets named "Weight" and "Muscle"
                    // You must adjust these names to match your specific GLB file
                    if (child.morphTargetDictionary['Weight'] !== undefined) {
                        child.morphTargetInfluences[child.morphTargetDictionary['Weight']] = morphs.weight;
                    }
                    if (child.morphTargetDictionary['Muscle'] !== undefined) {
                        child.morphTargetInfluences[child.morphTargetDictionary['Muscle']] = morphs.muscle;
                    }
                }
            }
        });
    }, [scene, color, customTexture, userTexture, morphs]);

    return <primitive object={scene} dispose={null} position={[0, -1, 0]} />;
}

// Preload the model to avoid glitches
useGLTF.preload('/models/mannequin.glb');
