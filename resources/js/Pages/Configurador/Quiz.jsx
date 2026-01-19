import React, { useState } from 'react';
import ConfiguradorLayout from '@/Layouts/ConfiguradorLayout';
import { Head } from '@inertiajs/react';

export default function Quiz() {
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState({});

    const questions = [
        {
            id: 1,
            title: "¿Cuál es tu entorno ideal para desconectar?",
            options: [
                { id: 'a', label: 'Un bosque nublado y silencioso', tag: 'Profundo' },
                { id: 'b', label: 'Una playa al atardecer', tag: 'Rítmico' },
                { id: 'c', label: 'Un jardín zen minimalista', tag: 'Visual' },
                { id: 'd', label: 'Una ciudad vibrante de noche', tag: 'Táctil' }
            ]
        },
        {
            id: 2,
            title: "¿Qué tipo de texturas prefieres?",
            options: [
                { id: 'a', label: 'Seda suave y fría', tag: 'Visual' },
                { id: 'b', label: 'Madera natural y cálida', tag: 'Táctil' },
                { id: 'c', label: 'Agua en movimiento', tag: 'Rítmico' },
                { id: 'd', label: 'Piedra pulida y pesada', tag: 'Profundo' }
            ]
        }
    ];

    const handleAnswer = (questionId, option) => {
        setAnswers({ ...answers, [questionId]: option });
        if (step < questions.length) {
            setStep(step + 1);
        } else {
            setStep('result');
        }
    };

    return (
        <ConfiguradorLayout>
            <Head title="Test de Identidad" />

            <section className="px-[5%] py-[150px] min-h-[80vh] flex items-center justify-center">
                <div className="max-w-[800px] w-full bg-white p-[60px] rounded-[var(--radius-lg)] shadow-[var(--shadow-medium)] border border-[var(--border)] text-center">

                    {step !== 'result' ? (
                        <div className="animate-fade-in-slide">
                            <span className="text-[0.7rem] uppercase tracking-[2px] font-bold text-[var(--color-primary)] mb-[20px] block">
                                Pregunta 0{step} de 0{questions.length}
                            </span>
                            <h2 className="font-['Cinzel'] text-[2.5rem] mb-[40px] leading-[1.2]">
                                {questions[step - 1].title}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                                {questions[step - 1].options.map(option => (
                                    <button
                                        key={option.id}
                                        className="btn-minimal btn-outline py-[25px] justify-center text-[1rem] hover:scale-[1.02]"
                                        onClick={() => handleAnswer(questions[step - 1].id, option)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="animate-fade-in-slide">
                            <div className="w-[100px] h-[100px] bg-[var(--color-primary)] rounded-full mx-auto mb-[30px] flex items-center justify-center text-white text-[2rem] animate-pulse-ring">
                                ✓
                            </div>
                            <h2 className="font-['Cinzel'] text-[3rem] mb-[20px]">Calibración Completada</h2>
                            <p className="text-[1.2rem] text-[var(--text-muted)] mb-[40px]">
                                Tu perfil de resonancia principal es: <strong className="text-[var(--color-primary)] uppercase tracking-wider">{answers[1]?.tag}</strong>.
                                Hemos ajustado el configurador con recomendaciones para ti.
                            </p>
                            <a href="/configurador/wizard" className="btn-minimal btn-primary px-[50px] py-[20px] text-[1.1rem]">
                                Ir al Configurador
                            </a>
                        </div>
                    )}
                </div>
            </section>
        </ConfiguradorLayout>
    );
}
