import React, { useMemo } from 'react';

/**
 * Mannequin2D - Granular Sprite Collage Engine.
 * Slices Head, Bust, Arms, Torso, Pelvis, and Legs from source images.
 */
const Mannequin2D = ({ bodyParams, selectedParts }) => {
    const bp = bodyParams || {};
    const sp = selectedParts || {};

    const dollRegistry = {
        'doll-1': { src: '/images/dolls/sources/doll-1.png' },
        'doll-2': { src: '/images/dolls/sources/doll-2.png' },
        'doll-3': { src: '/images/dolls/sources/doll-3.png' }
    };

    const transforms = useMemo(() => {
        const h = bp.height ?? 0.5;
        const hd = bp.head ?? 0.5;
        const sh = bp.shoulders ?? 0.5;
        const l = bp.legs ?? 0.5;
        const b = bp.bust ?? 0.5;
        const w = bp.waist ?? 0.5;

        return {
            overall: { transform: `scale(${0.9 + h * 0.2})`, transformOrigin: 'bottom center' },
            head: { transform: `translateY(${(1 - (0.9 + h * 0.2)) * 50}px) scale(${0.8 + hd * 0.4})`, transformOrigin: 'bottom center' },
            bust: { transform: `scale(${0.9 + b * 0.2})`, transformOrigin: 'center center' },
            arms: { transform: `scaleX(${0.8 + sh * 0.4})`, transformOrigin: 'center center' },
            torso: { transform: `scaleX(${0.9 + w * 0.2})`, transformOrigin: 'center center' },
            legs: { transform: `scaleY(${0.8 + l * 0.4})`, transformOrigin: 'top center' }
        };
    }, [bp]);

    const getDollSrc = (key) => dollRegistry[sp[key]]?.src || dollRegistry['doll-2'].src;

    return (
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-slate-950 rounded-3xl border border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_#1e293b_0%,_#020617_100%)] opacity-80" />

            <svg viewBox="0 0 400 600" className="relative w-auto h-[92%] drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]" style={transforms.overall}>
                <defs>
                    {/* MASKS FOR SMOOTH BLENDING */}
                    <mask id="head-mask"><ellipse cx="200" cy="100" rx="75" ry="90" fill="white" /></mask>
                    <mask id="bust-mask"><rect x="80" y="180" width="240" height="100" rx="30" fill="white" /></mask>
                    <mask id="arms-mask"><rect x="50" y="190" width="300" height="300" rx="50" fill="white" /></mask>
                    <mask id="torso-mask"><rect x="100" y="280" width="200" height="150" rx="40" fill="white" /></mask>
                    <mask id="pelvis-mask"><rect x="100" y="380" width="200" height="100" rx="40" fill="white" /></mask>
                    <mask id="legs-mask"><rect x="80" y="470" width="240" height="130" rx="40" fill="white" /></mask>
                </defs>

                {/* SHADOW */}
                <ellipse cx="200" cy="580" rx="120" ry="20" fill="black" opacity="0.5" />

                {/* LEGS */}
                <g style={transforms.legs}>
                    <image href={getDollSrc('legs')} x="0" y="0" width="400" height="600" preserveAspectRatio="xMidYMid slice" mask="url(#legs-mask)" clipPath="inset(450px 0 0 0)" />
                </g>

                {/* PELVIS / INTIMATE PARTS */}
                <g>
                    <image href={getDollSrc('pelvis')} x="0" y="0" width="400" height="600" preserveAspectRatio="xMidYMid slice" mask="url(#pelvis-mask)" clipPath="inset(350px 0 100px 0)" />
                </g>

                {/* TORSO / ABDOMEN */}
                <g style={transforms.torso}>
                    <image href={getDollSrc('torso')} x="0" y="0" width="400" height="600" preserveAspectRatio="xMidYMid slice" mask="url(#torso-mask)" clipPath="inset(250px 0 200px 0)" />
                </g>

                {/* ARMS */}
                <g style={transforms.arms}>
                    <image href={getDollSrc('arms')} x="0" y="0" width="400" height="600" preserveAspectRatio="xMidYMid slice" mask="url(#arms-mask)" clipPath="inset(150px 0 150px 0)" />
                </g>

                {/* BUST / PECHO */}
                <g style={transforms.bust}>
                    <image href={getDollSrc('bust')} x="0" y="0" width="400" height="600" preserveAspectRatio="xMidYMid slice" mask="url(#bust-mask)" clipPath="inset(160px 0 320px 0)" />
                </g>

                {/* HEAD */}
                <g style={transforms.head}>
                    <image href={getDollSrc('head')} x="0" y="0" width="400" height="600" preserveAspectRatio="xMidYMid slice" mask="url(#head-mask)" clipPath="inset(0 0 450px 0)" />
                </g>
            </svg>
        </div>
    );
};

export default Mannequin2D;
