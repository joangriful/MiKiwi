import React from 'react';
import ConfiguratorLayout from '@/Layouts/ConfiguratorLayout';
import { Head, Link } from '@inertiajs/react';
import styles from './Collections.module.css';

export default function Collections() {
    const products = [
        {
            id: 'shadow',
            name: 'Shadow Series',
            tag: 'Novedad',
            desc: 'Misterio en cada detalle. Acabado negro profundo y texturas táctiles.',
            color: '#222',
            price: '89€'
        },
        {
            id: 'pearl',
            name: 'Pearl Edition',
            tag: 'Elegancia',
            desc: 'Pureza y suavidad infinita. Inspirado en las olas del mar.',
            color: '#f8f5f0',
            price: '99€'
        },
        {
            id: 'signature',
            name: 'The Signature',
            tag: 'Premium',
            desc: 'Nuestro modelo más avanzado con tecnología de resonancia hápitica.',
            color: '#fff',
            price: '129€'
        }
    ];

    return (
        <ConfiguratorLayout>
            <Head title="Colecciones" />

            <section className={`${styles.root} px-[5%] py-[150px]`}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Colecciones</h1>
                    <p className={styles.description}>
                        Explora nuestra gama de productos diseñados para elevar tu experiencia sensorial.
                    </p>
                </div>

                <div className={styles.grid}>
                    {products.map(product => (
                        <article key={product.id} className={styles.card}>
                            <div
                                className={styles.preview}
                                style={{ background: `radial-gradient(circle, #fff 0%, ${product.id === 'shadow' ? '#ddd' : '#f0f4e8'} 100%)` }}
                            >
                                <div
                                    className={styles.previewShape}
                                    style={{ background: product.id === 'shadow' ? '#111' : '#eee', border: '1px solid rgba(0,0,0,0.05)' }}
                                />
                                <span className={styles.tag}>
                                    {product.tag}
                                </span>
                            </div>
                            <div className={styles.body}>
                                <h3 className={styles.productTitle}>{product.name}</h3>
                                <p className={styles.productDescription}>
                                    {product.desc}
                                </p>
                                <div className={styles.footer}>
                                    <span className={styles.price}>Desde {product.price}</span>
                                    <Link href="/configurador/wizard" className={`${styles.button} ${styles.primaryButton}`}>
                                        Personalizar
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </ConfiguratorLayout>
    );
}
