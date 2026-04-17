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
                <div className="text-center mb-[80px]">
                    <h1 className="font-['Cinzel'] text-[4rem] mb-[20px] text-[var(--text-main)]">Colecciones</h1>
                    <p className="text-[1.2rem] text-[var(--text-muted)] max-w-[700px] mx-auto">
                        Explora nuestra gama de productos diseñados para elevar tu experiencia sensorial.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
                    {products.map(product => (
                        <div key={product.id} className="minimal-card group bg-white">
                            <div className={`h-[350px] flex items-center justify-center relative overflow-hidden`} style={{ background: `radial-gradient(circle, #fff 0%, ${product.id === 'shadow' ? '#ddd' : '#f0f4e8'} 100%)` }}>
                                <div className="w-[100px] h-[300px] rounded-[50px] shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6" style={{ background: product.id === 'shadow' ? '#111' : '#eee', border: '1px solid rgba(0,0,0,0.05)' }}></div>
                                <span className="absolute top-[20px] right-[20px] px-[12px] py-[6px] bg-white/80 rounded-full text-[0.7rem] font-bold text-[var(--color-primary)] uppercase tracking-wider">
                                    {product.tag}
                                </span>
                            </div>
                            <div className="p-[30px]">
                                <h3 className="text-[1.5rem] font-bold mb-[10px] text-[var(--text-main)]">{product.name}</h3>
                                <p className="text-[var(--text-muted)] text-[0.9rem] mb-[25px] leading-[1.6]">
                                    {product.desc}
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-[1.2rem] font-medium text-[var(--text-main)]">Desde {product.price}</span>
                                    <Link href="/configurador/wizard" className="btn-minimal btn-primary">
                                        Personalizar
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </ConfiguratorLayout>
    );
}
