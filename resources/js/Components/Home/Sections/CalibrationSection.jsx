import React from 'react';
import { Link } from '@inertiajs/react';

export default function CalibrationSection({ calibrationImages = [] }) {
    // Look for the uploaded background or fallback to a solid color/placeholder
    const bgImage = calibrationImages.length > 0 ? calibrationImages[0].url : null;

    return (
        <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-black mt-0">
            {/* Background Image */}
            {bgImage ? (
                <img
                    src={bgImage}
                    alt="Calibration Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm">
                    <span>(Sube una imagen de Calibración en el Manager)</span>
                </div>
            )}

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-black mb-8 drop-shadow-lg tracking-tight">
                    ¿No sabes por dónde empezar?
                </h2>

                <Link
                    href="#"
                    className="inline-flex items-center justify-center px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-full shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_25px_rgba(37,99,235,0.6)] hover:-translate-y-1 transition-all duration-300 tracking-wide uppercase"
                >
                    CONÓCETE
                </Link>
            </div>

            {/* Dark gradient to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/80 pointer-events-none"></div>
        </section>
    );
}
