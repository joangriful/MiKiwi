import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../../../css/body-part-selector.css';

/**
 * BodyPartSelector
 * 
 * Compact grid-based component for selecting individual body parts.
 * Displays thumbnails in a grid layout similar to the reference design.
 */
const BodyPartSelector = ({
    selectedParts,
    onPartSelect,
    partLibrary
}) => { // Changed from function declaration to arrow function to match original
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (partLibrary) {
            setLoading(false);
        }
    }, [partLibrary]);

    if (loading || !partLibrary) {
        return (
            <div className="body-part-selector loading">
                <div className="loading-spinner"></div>
                <p>Cargando biblioteca de partes...</p>
            </div>
        );
    }

    // Get all available parts for a specific part type across all dolls
    const getAvailableParts = (partType) => {
        const parts = [];

        partLibrary.dolls.forEach((doll, index) => {
            if (doll.parts[partType]) {
                parts.push({
                    ...doll.parts[partType],
                    dollId: doll.id,
                    dollName: doll.name,
                    partType: partType,
                    variantNumber: index + 1 // Add numbering
                });
            }
        });

        return parts;
    };

    // Get part type metadata
    const getPartTypeName = (partType) => {
        const type = partLibrary.partTypes.find(t => t.id === partType);
        return type ? type.name : partType;
    };

    // Handle part selection
    const handlePartClick = (part) => {
        onPartSelect(part.partType, part);
    };

    // Check if a part is currently selected
    const isPartSelected = (part) => {
        const currentPart = selectedParts[part.partType];
        return currentPart &&
            currentPart.dollId === part.dollId &&
            currentPart.path === part.path;
    };

    // Render a single part thumbnail (compact square version)
    const renderPartThumbnail = (part) => {
        const selected = isPartSelected(part);

        return (
            <div
                key={`${part.dollId}-${part.partType}`}
                className={`part-thumbnail-compact ${selected ? 'selected' : ''}`}
                onClick={() => handlePartClick(part)}
                title={part.dollName}
            >
                <div className="thumbnail-image-wrapper">
                    <img
                        src={part.thumbnail || part.path}
                        alt={`${part.partType} ${part.variantNumber}`}
                        className="thumbnail-image-compact"
                        onError={(e) => {
                            e.target.style.opacity = '0.3';
                        }}
                    />
                    {selected && (
                        <div className="selected-checkmark">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" fill="#4CAF50" />
                                <path
                                    d="M9 12.5L11 14.5L15 10.5"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    )}
                </div>
                <div className="thumbnail-number">{part.variantNumber}</div>
            </div>
        );
    };

    // Render a section for a specific part type (compact version)
    const renderPartSection = (partType) => {
        const parts = getAvailableParts(partType);

        if (parts.length === 0) return null;

        return (
            <div key={partType} className="part-section-compact">
                <div className="part-section-header-compact">
                    <h3>{getPartTypeName(partType)}</h3>
                </div>

                <div className="part-grid-compact">
                    {parts.map(part => renderPartThumbnail(part))}
                </div>
            </div>
        );
    };

    // Part types in display order
    const partTypeOrder = ['head', 'torso', 'armLeft', 'armRight', 'legLeft', 'legRight'];

    return (
        <div className="body-part-selector-compact">
            <div className="selector-header-compact">
                <h2>ENSAMBLAR COLLAGE</h2>
            </div>

            <div className="part-sections-compact">
                {partTypeOrder.map(partType => renderPartSection(partType))}
            </div>
        </div>
    );
};

BodyPartSelector.propTypes = {
    selectedParts: PropTypes.object.isRequired,
    onPartSelect: PropTypes.func.isRequired,
    partLibrary: PropTypes.shape({
        dolls: PropTypes.array.isRequired,
        partTypes: PropTypes.array.isRequired
    }).isRequired
};

export default BodyPartSelector;
