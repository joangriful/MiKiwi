import React, { useRef } from 'react';
import { Html, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { DoubleSide } from 'three';
import styles from './ModelErrorBoundary.module.css';

function FallbackImagePlane({ imagePath }) {
    // Load the texture safely. If this fails, it might default to a placeholder or error out silently in console.
    // We assume imagePath is valid (e.g. /images/mannequin_ref.png)
    const texture = useTexture(imagePath);

    return (
        <mesh position={[0, 1.6, 0]}>
            <planeGeometry args={[1.5, 3.2]} />
            <meshBasicMaterial map={texture} transparent side={DoubleSide} alphaTest={0.5} />
        </mesh>
    );
}

class ModelErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.warn("3D Model missing, utilizing 2D fallback:", error);
    }

    render() {
        if (this.state.hasError) {
            return (
                <group>
                    {/* Fallback: 2D Image "Cutout" of the Mannequin */}
                    <React.Suspense fallback={null}>
                        <FallbackImagePlane imagePath={this.props.fallbackImage || '/images/mannequin_ref.png'} />
                    </React.Suspense>

                    <Html position={[0, 3.5, 0]} center>
                        <div className={styles.badge}>
                            <p className={styles.text}>⚠️ Modo 2D (Modelo 3D no encontrado)</p>
                        </div>
                    </Html>
                </group>
            );
        }

        return this.props.children;
    }
}

export default ModelErrorBoundary;
