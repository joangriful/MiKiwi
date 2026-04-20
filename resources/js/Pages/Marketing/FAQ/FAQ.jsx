import React, { useState } from 'react';
import Header from '@/Components/Header/Header';
import Footer from '@/Components/Footer/Footer';
import { Head } from '@inertiajs/react';

const faqData = [
    {
        category: "Envíos",
        questions: [
            { q: "¿Cuánto cuesta el envío?", a: "El envío es gratuito en pedidos superiores a 50€. Para pedidos inferiores, el coste es de 4,95€." },
            { q: "¿Cuánto tarda en llegar mi pedido?", a: "Los pedidos suelen entregarse en un plazo de 24 a 48 horas laborables." }
        ]
    },
    {
        category: "Productos",
        questions: [
            { q: "¿Cómo sé cuál es el juguete ideal para mí?", a: "Tenemos una guía en nuestro configurador que te ayudará a elegir basándote en tus preferencias." },
            { q: "¿Los materiales son seguros?", a: "Sí, todos nuestros productos están fabricados con silicona médica de alta calidad y son hipoalergénicos." }
        ]
    },
    {
        category: "Devoluciones",
        questions: [
            { q: "¿Puedo devolver un producto?", a: "Por motivos de higiene, solo aceptamos devoluciones de productos cuyo precinto de seguridad no haya sido manipulado." }
        ]
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="min-h-screen bg-bg-main text-text-main font-body">
            <Head title="Preguntas Frecuentes - MiKiwi" />
            <Header />
            <main className="container mx-auto px-6 py-12 md:py-20 max-w-4xl">
                <h1 className="text-2xl md:text-[32px] font-bold mb-10 md:mb-12 text-center text-secondary-dark font-head uppercase tracking-widest leading-tight">Preguntas frecuentes</h1>

                <div className="space-y-12">
                    {faqData.map((section, sIdx) => (
                        <div key={sIdx}>
                            <h2 className="text-xl font-bold mb-6 border-b pb-2 border-secondary/30 flex items-center gap-3 font-head">
                                <span className="w-2 h-8 bg-secondary rounded-full shadow-sm"></span>
                                {section.category}
                            </h2>
                            <div className="space-y-4">
                                {section.questions.map((item, qIdx) => {
                                    const index = `${sIdx}-${qIdx}`;
                                    const isOpen = openIndex === index;
                                    return (
                                        <div key={qIdx} className="bg-bg-surface border border-border rounded-xl overflow-hidden transition-all shadow-sm group">
                                            <button
                                                onClick={() => setOpenIndex(isOpen ? null : index)}
                                                className="w-full flex items-center justify-between p-5 text-left hover:bg-bg-main/50 transition-colors"
                                            >
                                                <span className="font-bold text-text-main group-hover:text-secondary-dark transition-colors font-head">{item.q}</span>
                                                <span className={`text-2xl text-secondary transition-transform duration-300 font-bold ${isOpen ? 'rotate-45' : ''}`}>
                                                    +
                                                </span>
                                            </button>
                                            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 py-6 px-6 bg-bg-main/20 border-t border-border' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                                <p className="text-text-main/80 leading-relaxed text-sm">
                                                    {item.a}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 bg-bg-surface rounded-2xl p-10 text-center border border-secondary/20 shadow-lg">
                    <h3 className="text-xl font-bold mb-4 font-head uppercase tracking-wider">¿No encuentras lo que buscas?</h3>
                    <p className="text-text-main/70 mb-8 max-w-md mx-auto text-sm">Nuestro equipo de soporte está disponible para resolver cualquier duda que tengas.</p>
                    <a
                        href="/contacto"
                        className="inline-block bg-text-main text-white px-10 py-3 rounded-full font-bold hover:bg-secondary-dark transition-all shadow-md uppercase tracking-widest text-xs"
                    >
                        Contáctanos
                    </a>
                </div>
            </main>
            <Footer />
        </div>
    );
}
