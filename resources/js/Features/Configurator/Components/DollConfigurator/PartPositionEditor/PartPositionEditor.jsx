import React, { useState, useRef, useEffect } from 'react';
import { getCloudinaryUrl } from '@/Utils/cloudinary';
import './PartPositionEditor.css';

export default function PartPositionEditor({ part, view, onClose, onSave }) {
    const [position, setPosition] = useState({ x: 0, y: 0, scale: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const imgRef = useRef(null);
    const containerRef = useRef(null);

    // Initial load logic could go here if we were passing existing pos
    // For now, start fresh or use passed props if available
    useEffect(() => {
        if (part.config) {
            setPosition({
                x: part.config.x || 0,
                y: part.config.y || 0,
                scale: part.config.scale || 1
            });
        }
    }, [part]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const onWheel = (e) => {
            e.preventDefault();
            const scaleChange = e.deltaY * -0.001;
            setPosition(prev => {
                const newScale = Math.min(Math.max(0.1, prev.scale + scaleChange), 5);
                return { ...prev, scale: newScale };
            });
        };

        container.addEventListener('wheel', onWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', onWheel);
        };
    }, []);

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        dragStartRef.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const newX = e.clientX - dragStartRef.current.x;
        const newY = e.clientY - dragStartRef.current.y;
        setPosition(prev => ({ ...prev, x: newX, y: newY }));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };


    const handleSave = () => {
        onSave({
            part_id: part.id,
            category: part.category, // Assuming part object has this
            view: view,
            x: position.x,
            y: position.y,
            scale: position.scale
        });
    };

    const imageUrl = getCloudinaryUrl(part.thumbnail || part.url, { transformations: 'f_auto,q_auto' });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl w-[90vw] h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Editor de Posición: {part.id}</h3>
                        <p className="text-sm text-gray-500">Arrastra para mover • Rueda para zoom</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                            Cancelar
                        </button>
                        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium shadow-md">
                            Guardar Posición
                        </button>
                    </div>
                </div>

                {/* Editor Canvas */}
                <div
                    className="flex-1 relative bg-[#e5e5f7] overflow-hidden cursor-move flex items-center justify-center"
                    style={{
                        backgroundImage: 'radial-gradient(#444cf7 0.5px, transparent 0.5px), radial-gradient(#444cf7 0.5px, #e5e5f7 0.5px)',
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 10px 10px'
                    }}
                    ref={containerRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
                        <div className="w-[500px] h-[500px] border-2 border-dashed border-black rounded-2xl"></div>
                    </div>

                    <img
                        ref={imgRef}
                        src={imageUrl}
                        alt={part.id}
                        className="max-w-none origin-center pointer-events-none select-none transition-transform duration-75" // Fast manual transform
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${position.scale})`
                        }}
                    />
                </div>

                {/* Footer Controls */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-6">
                    <div className="flex-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Zoom: {position.scale.toFixed(2)}x</label>
                        <input
                            type="range"
                            min="0.1"
                            max="3"
                            step="0.01"
                            value={position.scale}
                            onChange={(e) => setPosition(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
                        />
                    </div>
                    <div className="flex gap-4 border-l pl-6">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-500 uppercase">Pos X</span>
                            <span className="font-mono">{position.x.toFixed(0)}px</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-500 uppercase">Pos Y</span>
                            <span className="font-mono">{position.y.toFixed(0)}px</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setPosition({ x: 0, y: 0, scale: 1 })}
                        className="text-xs text-blue-600 hover:underline self-center"
                    >
                        Resetear
                    </button>
                </div>
            </div>
        </div>
    );
}
