import React from 'react';
import './DollsSection.css';

export default function DollsSection({ dollsImages }) {
    if (!dollsImages || dollsImages.length === 0) return null;

    return (
        <section className="dolls-section py-24 md:py-40 bg-white overflow-hidden ml-[var(--nav-width,0px)]" id="dolls-exploration">
            <div className="container mx-auto px-6 max-w-[1400px]">
                {/* Header Context */}
                <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-xl space-y-6">
                        <span className="text-[10px] font-bold tracking-[0.4em] text-[#99b849] uppercase block animate-in fade-in slide-in-from-bottom-2 duration-1000">
                            The Doll Experience
                        </span>
                        <h2 className="text-4xl md:text-7xl font-bold text-gray-900 tracking-tight leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                            Alta <br />Ingeniería<span className="text-[#99b849]">.</span>
                        </h2>
                        <p className="text-gray-400 text-lg md:text-xl font-light max-w-md leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                            Explora nuestra selección de muñecas hiperrealistas, diseñadas para una inmersión sensorial absoluta y una conexión sin precedentes.
                        </p>
                    </div>
                </div>

                {/* Staggered Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {dollsImages.map((image, index) => (
                        <div
                            key={index}
                            className="group relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-gray-50 border border-gray-100 shadow-xl shadow-black/5 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both"
                            style={{ animationDelay: `${index * 200 + 400}ms` }}
                        >
                            <img
                                src={image.url}
                                alt={`Doll ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            {/* Overlay info if available, or just a gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                <span className="text-white/60 text-[10px] uppercase tracking-widest font-bold mb-2">Luxury Variant</span>
                                <h3 className="text-white text-2xl font-bold tracking-tight">Nova Realista</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
