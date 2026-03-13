import React from 'react';
import { Link } from '@inertiajs/react';
import './CalibrationSection.css';

export default function CalibrationSection({ calibrationImages = [] }) {
    // Look for the uploaded background or fallback to a solid color/placeholder
    // Use the specific Cloudinary URL requested by the user
    const bgImage = "https://res.cloudinary.com/dquwonjie/image/upload/v1771865798/Julia_Platanomelon_944_iuusvc.jpg";

    return (
        <section className="relative w-full h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-black mt-0">
            {/* Background Image */}
            <img
                src={bgImage}
                alt="Calibration Background"
                className="absolute inset-0 w-full h-full object-cover opacity-50 contrast-125 saturate-50"
            />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-white text-4xl md:text-6xl lg:text-7xl font-black mb-10 drop-shadow-2xl tracking-widest
                 uppercase font-sugo" style={{ lineHeight: 0.9 }}>
                    ¿NO SABES POR DÓNDE EMPEZAR?
                </h2>

                <Link
                    href="/configurador/quiz"
                    className="btn-pill"
                >
                    CONÓCETE
                </Link>
            </div>

            {/* Dark gradient to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/80 pointer-events-none"></div>
        </section>
    );
}
