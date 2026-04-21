import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * SegmentedDoll2D
 * 
 * Renders a 2D composition of doll body parts using SVG.
 * Displays a body silhouette background with parts layered on top.
 */
export default function SegmentedDoll2D({
    selectedParts,
    bodyProportions = { height: 1, bust: 1, waist: 1, hips: 1 },
    canvasWidth = 800,
    canvasHeight = 1000,
    showGuides = false
}) {
    // Base dimensions for the doll composition
    const baseDimensions = {
        totalHeight: 900,
        totalWidth: 600,
        headHeight: 150,
        torsoHeight: 250,
        legsHeight: 500,
        centerX: canvasWidth / 2,
        neckY: 250,
        waistY: 500
    };

    // Calculate positions for each part based on anchor points
    const partPositions = useMemo(() => {
        const centerX = canvasWidth / 2;

        return {
            head: {
                x: centerX,
                y: 180,
                scale: 1
            },
            torso: {
                x: centerX,
                y: 400,
                scale: 1
            },
            armLeft: {
                x: centerX - 10, // Adjusted for "Brazo + Pecho" overlap
                y: 380,
                scale: 1
            },
            armRight: {
                x: centerX + 10, // Adjusted for "Brazo + Pecho" overlap
                y: 380,
                scale: 1
            },
            legLeft: {
                x: centerX - 5, // Adjusted for "Pierna + Pelvis" overlap
                y: 700,
                scale: 1
            },
            legRight: {
                x: centerX + 5, // Adjusted for "Pierna + Pelvis" overlap
                y: 700,
                scale: 1
            }
        };
    }, [canvasWidth]);

    // Render a single body part
    const renderPart = (partKey, partData, position, clipId) => {
        if (!partData || !partData.path) return null;

        const { path, width, height, anchorPoint } = partData;
        const { x, y, scale } = position;

        // Custom images from user are already cropped and 800x1000
        // We render them full size centered on the canvas if they are the new parts
        const isCustomPart = path.includes('/images/') && !path.includes('mannequin-base.png');

        if (isCustomPart) {
            return (
                <image
                    key={partKey}
                    href={path}
                    x={0}
                    y={0}
                    width={canvasWidth}
                    height={canvasHeight}
                    onError={(e) => {
                        console.warn(`Failed to load part: ${partKey}`, path);
                        e.target.style.opacity = '0.1';
                    }}
                />
            );
        }

        const transformOriginX = (anchorPoint?.x || 0.5) * width;
        const transformOriginY = (anchorPoint?.y || 0.5) * height;

        const adjustedX = x - transformOriginX;
        const adjustedY = y - transformOriginY;

        return (
            <g key={partKey} clipPath={clipId ? `url(#${clipId})` : undefined}>
                <image
                    href={path}
                    x={adjustedX}
                    y={adjustedY}
                    width={width * scale}
                    height={height * scale}
                    style={{
                        transformOrigin: `${transformOriginX}px ${transformOriginY}px`
                    }}
                    onError={(e) => {
                        console.warn(`Failed to load part: ${partKey}`, path);
                        e.target.style.opacity = '0.1';
                    }}
                />
            </g>
        );
    };

    // Order parts by z-index for correct layering
    const orderedParts = [
        { key: 'legLeft', part: selectedParts.legLeft, position: partPositions.legLeft, clipId: 'clip-leg-left' },
        { key: 'legRight', part: selectedParts.legRight, position: partPositions.legRight, clipId: 'clip-leg-right' },
        { key: 'armLeft', part: selectedParts.armLeft, position: partPositions.armLeft, clipId: 'clip-arm-left' },
        { key: 'armRight', part: selectedParts.armRight, position: partPositions.armRight, clipId: 'clip-arm-right' },
        { key: 'torso', part: selectedParts.torso, position: partPositions.torso, clipId: 'clip-torso' },
        { key: 'head', part: selectedParts.head, position: partPositions.head, clipId: 'clip-head' }
    ].filter(item => item.part);

    return (
        <div
            className="segmented-doll-2d-container"
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                position: 'relative'
            }}
        >
            <svg
                width={canvasWidth}
                height={canvasHeight}
                viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
                style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))'
                }}
            >
                <defs>
                    <linearGradient id="silhouetteGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.15)', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.05)', stopOpacity: 1 }} />
                    </linearGradient>

                    {/* Generous Clipping Paths for custom images (larger to avoid cutting off chest/hips) */}
                    <clipPath id="clip-head">
                        <path d="M400,50 Q500,50 500,180 Q500,300 400,300 Q300,300 300,180 Q300,50 400,50 Z" />
                    </clipPath>
                    <clipPath id="clip-torso">
                        <path d="M300,250 L500,250 Q520,350 500,550 L300,550 Q280,350 300,250 Z" />
                    </clipPath>
                    <clipPath id="clip-arm-left">
                        <path d="M0,0 H400 V600 H0 Z" /> {/* Very generous for composite parts */}
                    </clipPath>
                    <clipPath id="clip-arm-right">
                        <path d="M400,0 H800 V600 H400 Z" />
                    </clipPath>
                    <clipPath id="clip-leg-left">
                        <path d="M0,500 H400 V1000 H0 Z" />
                    </clipPath>
                    <clipPath id="clip-leg-right">
                        <path d="M400,500 H800 V1000 H400 Z" />
                    </clipPath>
                </defs>

                {/* Technical Mannequin Base (Official) - Fades out when parts are selected */}
                <image
                    href="/images/mannequin-base.png"
                    x={(canvasWidth / 2) - 400}
                    y="0"
                    width="800"
                    height="1000"
                    opacity={orderedParts.length > 0 ? 0 : 0.4}
                    style={{ transition: 'opacity 0.3s ease-in-out' }}
                />

                {/* Render actual parts with individual clipping */}
                {orderedParts.map(({ key, part, position, clipId }) =>
                    renderPart(key, part, position, clipId)
                )}

                {/* Optional alignment guides */}
                {showGuides && (
                    <g className="guides">
                        <line
                            x1={baseDimensions.centerX}
                            y1="0"
                            x2={baseDimensions.centerX}
                            y2={canvasHeight}
                            stroke="red"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                            opacity="0.5"
                        />
                        <line
                            x1="0"
                            y1={baseDimensions.neckY}
                            x2={canvasWidth}
                            y2={baseDimensions.neckY}
                            stroke="blue"
                            strokeWidth="1"
                            strokeDasharray="3,3"
                            opacity="0.5"
                        />
                        <line
                            x1="0"
                            y1={baseDimensions.waistY}
                            x2={canvasWidth}
                            y2={baseDimensions.waistY}
                            stroke="blue"
                            strokeWidth="1"
                            strokeDasharray="3,3"
                            opacity="0.5"
                        />
                    </g>
                )}

                {/* Empty state message */}
                {orderedParts.length === 0 && (
                    <text
                        x={canvasWidth / 2}
                        y={canvasHeight / 2}
                        textAnchor="middle"
                        fill="white"
                        fontSize="20"
                        fontFamily="Arial, sans-serif"
                        opacity="0.7"
                    >
                    </text>
                )}
            </svg>
        </div>
    );
}

SegmentedDoll2D.propTypes = {
    selectedParts: PropTypes.shape({
        head: PropTypes.object,
        torso: PropTypes.object,
        armLeft: PropTypes.object,
        armRight: PropTypes.object,
        legLeft: PropTypes.object,
        legRight: PropTypes.object
    }).isRequired,
    bodyProportions: PropTypes.shape({
        height: PropTypes.number,
        bust: PropTypes.number,
        waist: PropTypes.number,
        hips: PropTypes.number
    }),
    canvasWidth: PropTypes.number,
    canvasHeight: PropTypes.number,
    showGuides: PropTypes.bool
};
