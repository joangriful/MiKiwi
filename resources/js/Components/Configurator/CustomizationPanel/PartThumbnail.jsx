import React from 'react';

/**
 * PartThumbnail - Renders a specific body part from a doll source.
 * Uses SVG views to focus on Head, Bust, Arms, etc.
 */
const PartThumbnail = ({ source, partType, isSelected, onClick }) => {
    // Shared geometry with Mannequin2D for consistency
    const masks = {
        head: { cx: 200, cy: 110, rx: 80, ry: 100, viewBox: "120 10 160 200" },
        bust: { x: 80, y: 180, w: 240, h: 100, rx: 30, viewBox: "80 160 240 140" },
        arms: { x: 50, y: 190, w: 300, h: 300, rx: 50, viewBox: "50 150 300 300" },
        torso: { x: 100, y: 280, w: 200, h: 150, rx: 40, viewBox: "100 250 200 200" },
        pelvis: { x: 100, y: 380, w: 200, h: 100, rx: 40, viewBox: "100 350 200 150" },
        legs: { x: 80, y: 470, w: 240, h: 130, rx: 40, viewBox: "80 430 240 170" }
    };

    const geometry = masks[partType] || masks.head;

    return (
        <button
            onClick={onClick}
            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all p-1 bg-white shadow-sm ${isSelected
                    ? 'border-blue-600 ring-2 ring-blue-100 scale-95'
                    : 'border-gray-100 hover:border-blue-200 hover:shadow-md'
                }`}
        >
            <svg
                viewBox={geometry.viewBox}
                className="w-full h-full object-contain"
            >
                <defs>
                    <clipPath id={`clip-${partType}-${source}`}>
                        {partType === 'head' ? (
                            <ellipse cx={geometry.cx} cy={geometry.cy} rx={geometry.rx} ry={geometry.ry} />
                        ) : (
                            <rect x={geometry.x} y={geometry.y} width={geometry.w} height={geometry.h} rx={geometry.rx} />
                        )}
                    </clipPath>
                    <mask id={`mask-${partType}-${source}`}>
                        <rect x="0" y="0" width="400" height="600" fill="white" />
                        {/* We could add some feathering here if needed */}
                    </mask>
                </defs>

                <image
                    href={source}
                    x="0" y="0" width="400" height="600"
                    preserveAspectRatio="xMidYMid slice"
                />
            </svg>

            {/* Selection indicator */}
            {isSelected && (
                <div className="absolute top-1 right-1 bg-blue-600 rounded-full p-0.5 shadow-sm">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
        </button>
    );
};

export default PartThumbnail;
