import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import MarketingPageLayout from '@/Components/Marketing/MarketingPageLayout/MarketingPageLayout';
import styles from './FAQ.module.css';

const faqData = [
    {
        category: 'Envíos',
        questions: [
            { q: '¿Cuánto cuesta el envío?', a: 'El envío es gratuito en pedidos superiores a 50€. Para pedidos inferiores, el coste es de 4,95€.' },
            { q: '¿Cuánto tarda en llegar mi pedido?', a: 'Los pedidos suelen entregarse en un plazo de 24 a 48 horas laborables.' },
        ],
    },
    {
        category: 'Productos',
        questions: [
            { q: '¿Cómo sé cuál es el juguete ideal para mí?', a: 'Tenemos una guía en nuestro configurador que te ayudará a elegir basándote en tus preferencias.' },
            { q: '¿Los materiales son seguros?', a: 'Sí, todos nuestros productos están fabricados con silicona médica de alta calidad y son hipoalergénicos.' },
        ],
    },
    {
        category: 'Devoluciones',
        questions: [
            { q: '¿Puedo devolver un producto?', a: 'Por motivos de higiene, solo aceptamos devoluciones de productos cuyo precinto de seguridad no haya sido manipulado.' },
        ],
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <MarketingPageLayout title="Preguntas frecuentes" maxWidth="narrow" showBreadcrumb={false}>
            <div className={styles.groups}>
                {faqData.map((section, sectionIndex) => (
                    <section className={styles.group} key={section.category}>
                        <h2>{section.category}</h2>
                        <div className={styles.items}>
                            {section.questions.map((item, questionIndex) => {
                                const index = `${sectionIndex}-${questionIndex}`;
                                const isOpen = openIndex === index;

                                return (
                                    <article className={styles.item} key={item.q}>
                                        <button
                                            aria-expanded={isOpen}
                                            className={styles.question}
                                            onClick={() => setOpenIndex(isOpen ? null : index)}
                                            type="button"
                                        >
                                            <span>{item.q}</span>
                                            <span className={isOpen ? styles.openIcon : styles.icon}>+</span>
                                        </button>
                                        <div className={isOpen ? styles.answerOpen : styles.answer}>
                                            <p>{item.a}</p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>

            <section className={styles.cta}>
                <h2>¿No encuentras lo que buscas?</h2>
                <p>Nuestro equipo de soporte está disponible para resolver cualquier duda que tengas.</p>
                <Link href={route('contacto')}>Contáctanos</Link>
            </section>
        </MarketingPageLayout>
    );
}
