import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function DollModel({
  hairStyle,
  hairColor,
  eyeColor,
  eyeSize,
  skinTone,
  bodyProportions
}) {
  const groupRef = useRef();
  const headRef = useRef();

  // Gentle idle animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  // Body proportions with defaults
  const proportions = useMemo(() => ({
    height: bodyProportions.height || 1,
    bust: bodyProportions.bust || 1,
    waist: bodyProportions.waist || 1,
    hips: bodyProportions.hips || 1,
  }), [bodyProportions]);

  // Skin shader material for more realistic skin
  const skinMaterial = useMemo(() => (
    <meshStandardMaterial
      color={skinTone}
      roughness={0.35}
      metalness={0.05}
      envMapIntensity={0.5}
    />
  ), [skinTone]);

  return (
    <group ref={groupRef} position={[0, -1.2, 0]}>
      {/* Head */}
      <group ref={headRef} position={[0, 1.6 * proportions.height, 0]}>
        {/* Face */}
        <mesh castShadow>
          <sphereGeometry args={[0.28, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.85]} />
          {skinMaterial}
        </mesh>

        {/* Jaw */}
        <mesh position={[0, -0.15, 0.05]} castShadow>
          <sphereGeometry args={[0.2, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          {skinMaterial}
        </mesh>

        {/* Eyes */}
        <group position={[0, 0.05, 0.24]}>
          {/* Left eye white */}
          <mesh position={[-0.09, 0, 0]}>
            <sphereGeometry args={[0.045 * eyeSize, 16, 16]} />
            <meshStandardMaterial color="#fff" roughness={0.1} />
          </mesh>
          {/* Left iris */}
          <mesh position={[-0.09, 0, 0.04 * eyeSize]}>
            <sphereGeometry args={[0.025 * eyeSize, 16, 16]} />
            <meshStandardMaterial color={eyeColor} roughness={0.2} metalness={0.8} emissive={eyeColor} emissiveIntensity={0.2} />
          </mesh>

          {/* Right eye white */}
          <mesh position={[0.09, 0, 0]}>
            <sphereGeometry args={[0.045 * eyeSize, 16, 16]} />
            <meshStandardMaterial color="#fff" roughness={0.1} />
          </mesh>
          {/* Right iris */}
          <mesh position={[0.09, 0, 0.04 * eyeSize]}>
            <sphereGeometry args={[0.025 * eyeSize, 16, 16]} />
            <meshStandardMaterial color={eyeColor} roughness={0.2} metalness={0.8} emissive={eyeColor} emissiveIntensity={0.2} />
          </mesh>

          {/* Eyelashes effect */}
          <mesh position={[-0.09, 0.03, 0.03]}>
            <torusGeometry args={[0.045 * eyeSize, 0.002, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[0.09, 0.03, 0.03]}>
            <torusGeometry args={[0.045 * eyeSize, 0.002, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        </group>

        {/* Nose */}
        <mesh position={[0, -0.02, 0.27]} castShadow>
          <coneGeometry args={[0.035, 0.08, 8]} />
          {skinMaterial}
        </mesh>

        {/* Lips */}
        <group position={[0, -0.12, 0.22]}>
          <mesh>
            <sphereGeometry args={[0.08, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.35]} />
            <meshStandardMaterial color="#d4908d" roughness={0.3} metalness={0.1} />
          </mesh>
        </group>

        {/* Hair */}
        {hairStyle === 'long' && (
          <>
            <mesh position={[0, 0.15, -0.05]} castShadow>
              <sphereGeometry args={[0.32, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
              <meshStandardMaterial color={hairColor} roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.3, -0.15]} rotation={[0.2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.12, 1.0, 20]} />
              <meshStandardMaterial color={hairColor} roughness={0.7} />
            </mesh>
          </>
        )}

        {hairStyle === 'short' && (
          <mesh position={[0, 0.15, -0.05]} castShadow>
            <sphereGeometry args={[0.30, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={hairColor} roughness={0.7} />
          </mesh>
        )}

        {hairStyle === 'ponytail' && (
          <>
            <mesh position={[0, 0.15, -0.05]} castShadow>
              <sphereGeometry args={[0.30, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              <meshStandardMaterial color={hairColor} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.1, -0.35]} rotation={[0.5, 0, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.04, 0.6, 16]} />
              <meshStandardMaterial color={hairColor} roughness={0.7} />
            </mesh>
          </>
        )}

        {hairStyle === 'curly' && (
          <group position={[0, 0.15, -0.05]}>
            <mesh castShadow>
              <sphereGeometry args={[0.33, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
              <meshStandardMaterial color={hairColor} roughness={0.9} />
            </mesh>
            {[...Array(12)].map((_, i) => (
              <mesh
                key={i}
                position={[
                  Math.cos(i * Math.PI / 6) * 0.28,
                  -0.1 + Math.random() * 0.05,
                  Math.sin(i * Math.PI / 6) * 0.28
                ]}
                castShadow
              >
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshStandardMaterial color={hairColor} roughness={0.9} />
              </mesh>
            ))}
          </group>
        )}
      </group>

      {/* Neck */}
      <mesh position={[0, 1.35 * proportions.height, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.13, 0.2, 20]} />
        {skinMaterial}
      </mesh>

      {/* Shoulders */}
      <mesh position={[0, 1.2 * proportions.height, 0]} castShadow>
        <sphereGeometry args={[0.22, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
        {skinMaterial}
      </mesh>

      {/* Upper Torso */}
      <mesh position={[0, 0.95 * proportions.height, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.16 * proportions.waist, 0.35 * proportions.height, 24]} />
        {skinMaterial}
      </mesh>

      {/* Breasts - Anatomically detailed */}
      <group position={[0, 1.05 * proportions.height, 0.1]}>
        {/* Left breast */}
        <mesh position={[-0.11, -0.05, 0]} rotation={[0.3, -0.1, 0]} castShadow>
          <sphereGeometry args={[0.14 * proportions.bust, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
          <meshStandardMaterial color={skinTone} roughness={0.25} metalness={0.05} />
        </mesh>
        {/* Left nipple */}
        <mesh position={[-0.11, -0.08, 0.12 * proportions.bust]} castShadow>
          <sphereGeometry args={[0.02 * proportions.bust, 12, 12]} />
          <meshStandardMaterial color="#c97c7c" roughness={0.4} />
        </mesh>
        <mesh position={[-0.11, -0.08, 0.13 * proportions.bust]} castShadow>
          <cylinderGeometry args={[0.012 * proportions.bust, 0.015 * proportions.bust, 0.02, 12]} />
          <meshStandardMaterial color="#b86b6b" roughness={0.4} />
        </mesh>

        {/* Right breast */}
        <mesh position={[0.11, -0.05, 0]} rotation={[0.3, 0.1, 0]} castShadow>
          <sphereGeometry args={[0.14 * proportions.bust, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
          <meshStandardMaterial color={skinTone} roughness={0.25} metalness={0.05} />
        </mesh>
        {/* Right nipple */}
        <mesh position={[0.11, -0.08, 0.12 * proportions.bust]} castShadow>
          <sphereGeometry args={[0.02 * proportions.bust, 12, 12]} />
          <meshStandardMaterial color="#c97c7c" roughness={0.4} />
        </mesh>
        <mesh position={[0.11, -0.08, 0.13 * proportions.bust]} castShadow>
          <cylinderGeometry args={[0.012 * proportions.bust, 0.015 * proportions.bust, 0.02, 12]} />
          <meshStandardMaterial color="#b86b6b" roughness={0.4} />
        </mesh>
      </group>

      {/* Waist */}
      <mesh position={[0, 0.72 * proportions.height, 0]} castShadow>
        <cylinderGeometry args={[0.16 * proportions.waist, 0.18 * proportions.waist, 0.22 * proportions.height, 24]} />
        {skinMaterial}
      </mesh>

      {/* Hips and buttocks - Anatomically detailed */}
      <group position={[0, 0.55 * proportions.height, 0]}>
        {/* Front hip area */}
        <mesh castShadow>
          <sphereGeometry args={[0.22 * proportions.hips, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
          {skinMaterial}
        </mesh>

        {/* Buttocks - detailed */}
        <group position={[0, 0, -0.05]}>
          {/* Left buttock */}
          <mesh position={[-0.09 * proportions.hips, -0.05, 0]} rotation={[0.2, 0, 0.1]} castShadow>
            <sphereGeometry args={[0.16 * proportions.hips, 24, 24, 0, Math.PI, Math.PI * 0.3, Math.PI * 0.5]} />
            <meshStandardMaterial color={skinTone} roughness={0.3} metalness={0.05} />
          </mesh>
          {/* Right buttock */}
          <mesh position={[0.09 * proportions.hips, -0.05, 0]} rotation={[0.2, 0, -0.1]} castShadow>
            <sphereGeometry args={[0.16 * proportions.hips, 24, 24, 0, Math.PI, Math.PI * 0.3, Math.PI * 0.5]} />
            <meshStandardMaterial color={skinTone} roughness={0.3} metalness={0.05} />
          </mesh>
        </group>

        {/* Genital area suggestion (artistic, non-explicit) */}
        <mesh position={[0, -0.08, 0.14 * proportions.hips]} rotation={[0.5, 0, 0]} castShadow>
          <sphereGeometry args={[0.06, 16, 16, 0, Math.PI * 2, Math.PI * 0.3, Math.PI * 0.4]} />
          <meshStandardMaterial color={skinTone} roughness={0.35} />
        </mesh>
      </group>

      {/* Left Arm */}
      <group position={[-0.25, 1.1 * proportions.height, 0]} rotation={[0, 0, 0.4]}>
        {/* Upper arm */}
        <mesh position={[0, -0.15, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.35, 12, 20]} />
          {skinMaterial}
        </mesh>
        {/* Forearm */}
        <mesh position={[0, -0.45, 0]} castShadow>
          <capsuleGeometry args={[0.06, 0.35, 12, 20]} />
          {skinMaterial}
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.7, 0]} castShadow>
          <sphereGeometry args={[0.055, 12, 12]} />
          {skinMaterial}
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.25, 1.1 * proportions.height, 0]} rotation={[0, 0, -0.4]}>
        {/* Upper arm */}
        <mesh position={[0, -0.15, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.35, 12, 20]} />
          {skinMaterial}
        </mesh>
        {/* Forearm */}
        <mesh position={[0, -0.45, 0]} castShadow>
          <capsuleGeometry args={[0.06, 0.35, 12, 20]} />
          {skinMaterial}
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.7, 0]} castShadow>
          <sphereGeometry args={[0.055, 12, 12]} />
          {skinMaterial}
        </mesh>
      </group>

      {/* Left Leg */}
      <group position={[-0.12, 0.55 * proportions.height, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.25 * proportions.height, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.45 * proportions.height, 16, 24]} />
          {skinMaterial}
        </mesh>
        {/* Calf */}
        <mesh position={[0, -0.65 * proportions.height, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.4 * proportions.height, 16, 24]} />
          {skinMaterial}
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.92 * proportions.height, 0.05]} rotation={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 0.1, 0.22]} />
          {skinMaterial}
        </mesh>
      </group>

      {/* Right Leg */}
      <group position={[0.12, 0.55 * proportions.height, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.25 * proportions.height, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.45 * proportions.height, 16, 24]} />
          {skinMaterial}
        </mesh>
        {/* Calf */}
        <mesh position={[0, -0.65 * proportions.height, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.4 * proportions.height, 16, 24]} />
          {skinMaterial}
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.92 * proportions.height, 0.05]} rotation={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 0.1, 0.22]} />
          {skinMaterial}
        </mesh>
      </group>
    </group>
  );
}
