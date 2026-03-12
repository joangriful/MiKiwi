import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import Header from '@/Components/Common/Header';
import Footer from '@/Components/Common/Footer';
import './Quiz.css';

const QUIZ_STEPS = [
    {
        id: 1,
        tag: "Personalidad",
        title: "¿Cómo describirías tu enfoque ante nuevas experiencias?",
        options: [
            {
                id: 'curious',
                label: 'Explorador/a',
                desc: 'Busco constantemente descubrir sensaciones que nunca he sentido.',
                scores: { 'Ondas de Presión': 3, 'Sensaciones': 2, 'BDSM y Fetiche': 1 }
            },
            {
                id: 'sensual',
                label: 'Sensual',
                desc: 'Disfruto de los detalles, la lentitud y la conexión profunda.',
                scores: { 'Lubricantes': 3, 'Vibradores Externos': 2, 'Cuidado del Cuerpo': 2 }
            },
            {
                id: 'bold',
                label: 'Audaz',
                desc: 'Me gusta la intensidad y los retos que me saquen de mi zona de confort.',
                scores: { 'Impacto': 3, 'Restricción': 2, 'Plugs Anales': 2 }
            },
            {
                id: 'balanced',
                label: 'Equilibrado/a',
                desc: 'Busco el bienestar y el autoconocimiento en cada paso.',
                scores: { 'Salud Íntima': 3, 'Dildos': 2, 'Higiene': 1 }
            }
        ]
    },
    {
        id: 2,
        tag: "Estado de Ánimo",
        title: "Si hoy fuera un escenario, ¿cuál elegirías?",
        options: [
            {
                id: 'storm',
                label: 'Una tormenta eléctrica',
                desc: 'Energía pura, descargas intensas y contrastes fuertes.',
                scores: { 'Ondas de Presión': 4, 'Impacto': 2 }
            },
            {
                id: 'spa',
                label: 'Un refugio de aguas termales',
                desc: 'Calma, temperatura perfecta y relajación muscular total.',
                scores: { 'Cuidado del Cuerpo': 4, 'Salud Íntima': 2 }
            },
            {
                id: 'club',
                label: 'Un club clandestino',
                desc: 'Misterio, cuero y la sensación de lo prohibido.',
                scores: { 'Cuero y Textil': 4, 'Restricción': 2 }
            },
            {
                id: 'garden',
                label: 'Un jardín secreto al amanecer',
                desc: 'Frescura, sutileza y el despertar de los sentidos.',
                scores: { 'Sensaciones': 4, 'Vibradores Externos': 2 }
            }
        ]
    },
    {
        id: 3,
        tag: "Sentidos",
        title: "¿Qué sentido guía tu placer con más fuerza?",
        options: [
            {
                id: 'touch',
                label: 'El Tacto',
                desc: 'La textura de los materiales y la presión sobre la piel.',
                scores: { 'Cuero y Textil': 3, 'Dildos': 3, 'Masturbadores': 2 }
            },
            {
                id: 'vision',
                label: 'La Vista',
                desc: 'El diseño, la estética y la belleza de los objetos.',
                scores: { 'Vibradores Externos': 3, 'Ondas de Presión': 2 }
            },
            {
                id: 'hearing',
                label: 'El Oído',
                desc: 'El ritmo, el silencio o el sonido susurrante de la vibración.',
                scores: { 'Salud Íntima': 3, 'Sensaciones': 2 }
            },
            {
                id: 'smell',
                label: 'El Olfato',
                desc: 'La atmósfera, los aromas y la química del momento.',
                scores: { 'Lubricantes': 4, 'Cuidado del Cuerpo': 3 }
            }
        ]
    },
    {
        id: 4,
        tag: "Deseo",
        title: "En este momento, ¿qué es lo que más anhelas?",
        options: [
            {
                id: 'control',
                label: 'Jugar con el control',
                desc: 'Ya sea entregándolo o tomándolo, me fascina el poder.',
                scores: { 'Restricción': 4, 'Impacto': 3, 'Cuero y Textil': 2 }
            },
            {
                id: 'climax',
                label: 'Un clímax explosivo',
                desc: 'Sin rodeos, busco la culminación más potente posible.',
                scores: { 'Ondas de Presión': 5, 'Vibradores Externos': 2 }
            },
            {
                id: 'connection',
                label: 'Conectar con mi cuerpo',
                desc: 'Entender mis ritmos y cuidar mi salud sexual.',
                scores: { 'Salud Íntima': 4, 'Dilatadores y Kits de Inicio': 3 }
            },
            {
                id: 'sharing',
                label: 'Compartir la chispa',
                desc: 'Busco algo que pueda integrar en mis relaciones.',
                scores: { 'Anillos Vibradores': 4, 'Arneses y Strapless': 3, 'Lubricantes': 2 }
            }
        ]
    }
];

export default function Quiz() {
    const [currentStep, setCurrentStep] = useState(0);
    const [scores, setScores] = useState({});
    const [history, setHistory] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const [resultCategory, setResultCategory] = useState(null);
    const { auth } = usePage().props;

    // Load quiz data from localStorage on mount (for unauthenticated users)
    useEffect(() => {
        const savedQuizData = localStorage.getItem('quizData');
        if (savedQuizData) {
            try {
                const { currentStep: step, scores: savedScores, history: savedHistory, resultCategory: result } = JSON.parse(savedQuizData);
                setCurrentStep(step);
                setScores(savedScores);
                setHistory(savedHistory);
                setResultCategory(result);
                setIsFinished(!!result);
            } catch (e) {
                console.error('Error loading quiz data from localStorage', e);
            }
        }
    }, []);

    // Save quiz data to localStorage whenever it changes (for unauthenticated users)
    useEffect(() => {
        if (!auth?.user) {
            localStorage.setItem('quizData', JSON.stringify({
                currentStep,
                scores,
                history,
                resultCategory,
                timestamp: new Date().toISOString()
            }));
        }
    }, [currentStep, scores, history, resultCategory, auth?.user]);

    const handleOptionClick = (optionScores) => {
        setHistory([...history, scores]);
        const newScores = { ...scores };
        Object.entries(optionScores).forEach(([category, score]) => {
            newScores[category] = (newScores[category] || 0) + score;
        });
        setScores(newScores);

        if (currentStep < QUIZ_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            calculateResult(newScores);
        }
    };

    const calculateResult = (finalScores) => {
        let bestCategory = null;
        let maxScore = -1;

        Object.entries(finalScores).forEach(([category, score]) => {
            if (score > maxScore) {
                maxScore = score;
                bestCategory = category;
            }
        });

        setResultCategory(bestCategory);
        setIsFinished(true);

        if (auth?.user) {
            // If authenticated, save immediately to database
            axios.post(route('profile.quiz.save'), { category: bestCategory })
                .catch(err => console.error('Error saving quiz result', err));
        } else {
            // If not authenticated, quiz data is saved to localStorage via useEffect
            // Show message to login/register
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            const previousScores = history[history.length - 1] || {};
            setScores(previousScores);
            setHistory(history.slice(0, -1));
        }
    };

    const resetQuiz = () => {
        setCurrentStep(0);
        setScores({});
        setHistory([]);
        setIsFinished(false);
        setResultCategory(null);
    };

    // Messages based on the winner category
    const getResultContent = () => {
        const messages = {
            'Ondas de Presión': {
                title: 'Energía Eléctrica',
                text: 'Sientes que hoy necesitas algo que rompa la rutina con fuerza. Tu identidad es vibrante y buscas experiencias que te dejen sin aliento, enfocadas en la intensidad pura y el descubrimiento tecnológico.'
            },
            'Sensaciones': {
                title: 'Explorador/a de la Calma',
                text: 'Te sientes en un momento de introspección y mimo. Tu identidad hoy pide sutileza, texturas suaves y un despertar pausado de cada rincón de tu piel.'
            },
            'Restricción': {
                title: 'El Juego del Poder',
                text: 'Hoy te sientes audaz y con ganas de explorar los límites del control. Tu identidad busca la seguridad de la entrega o la fuerza del dominio, siempre bajo tus propias reglas.'
            },
            'Salud Íntima': {
                title: 'Conexión Armónica',
                text: 'Te sientes en sintonía con tu bienestar. Tu identidad hoy se centra en el autoconocimiento y la salud, buscando un equilibrio perfecto entre placer y cuidado personal.'
            },
            'Lubricantes': {
                title: 'Fluidez y Deseo',
                text: 'Hoy buscas que todo fluya. Te sientes sensual y detallista, valorando la atmósfera y la química por encima de la intensidad directa.'
            }
        };

        const winner = resultCategory || 'Sensaciones';
        return messages[winner] || {
            title: `Identidad: ${winner}`,
            text: `Tus elecciones muestran que hoy te sientes en sintonía con ${winner}. Es el momento ideal para explorar esta faceta de tu identidad.`
        };
    };

    const resultContent = getResultContent();

    return (
        <div className="quiz-container">
            <Head title="Quiz de Identidad - MiKiwi" />
            <Header />

            <main className="quiz-main">
                <div className="quiz-blob quiz-blob-1"></div>
                <div className="quiz-blob quiz-blob-2"></div>

                <div className="quiz-card">
                    {!isFinished ? (
                        <div key={currentStep} className="animate-step">
                            <div className="flex justify-between items-center w-full mb-4">
                                {currentStep > 0 ? (
                                    <button 
                                        onClick={handleBack} 
                                        className="text-gray-500 hover:text-[#99b849] transition-colors flex items-center gap-1 text-sm font-medium z-10 cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-base">arrow_back</span>
                                        Volver
                                    </button>
                                ) : (
                                    <div></div>
                                )}
                            </div>
                            <div className="quiz-step-indicator">
                                {QUIZ_STEPS.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`step-dot ${idx <= currentStep ? 'active' : ''}`}
                                    />
                                ))}
                            </div>

                            <span className="quiz-question-tag">
                                {QUIZ_STEPS[currentStep].tag} • Pregunta {currentStep + 1} de {QUIZ_STEPS.length}
                            </span>

                            <h2 className="quiz-title">
                                {QUIZ_STEPS[currentStep].title}
                            </h2>

                            <div className="quiz-options">
                                {QUIZ_STEPS[currentStep].options.map((option) => (
                                    <button
                                        key={option.id}
                                        className="option-button"
                                        onClick={() => handleOptionClick(option.scores)}
                                    >
                                        <span className="option-label">{option.label}</span>
                                        <span className="option-description">{option.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="animate-step text-center">
                            <div className="result-header">
                                <div className="result-icon">✨</div>
                                <span className="quiz-question-tag">Tu Perfil de Identidad</span>
                                <h2 className="result-category">{resultContent.title}</h2>
                            </div>

                            <p className="result-text">
                                {resultContent.text}
                            </p>

                            {auth?.user ? (
                                // Authenticated user
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href="/perfil"
                                        className="btn-minimal bg-[#99b849] text-white px-8 py-4 rounded-lg font-bold hover:scale-105 transition-all"
                                    >
                                        Ver mis recomendaciones
                                    </Link>
                                    <button
                                        onClick={resetQuiz}
                                        className="btn-restart"
                                    >
                                        Repetir Test
                                    </button>
                                </div>
                            ) : (
                                // Unauthenticated user
                                <div className="flex flex-col gap-4 justify-center">
                                    <p className="text-gray-600 mb-4">
                                        Crea una cuenta o inicia sesión para guardar tus recomendaciones
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Link
                                            href="/register"
                                            className="btn-minimal bg-[#99b849] text-white px-8 py-4 rounded-lg font-bold hover:scale-105 transition-all"
                                        >
                                            Crear Cuenta
                                        </Link>
                                        <Link
                                            href="/login"
                                            className="btn-minimal border-2 border-[#99b849] text-[#99b849] px-8 py-4 rounded-lg font-bold hover:bg-[#99b849] hover:text-white transition-all"
                                        >
                                            Iniciar Sesión
                                        </Link>
                                    </div>
                                    <button
                                        onClick={resetQuiz}
                                        className="btn-restart mt-4"
                                    >
                                        Repetir Test
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
