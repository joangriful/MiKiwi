import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header/Header';
import Footer from '@/Components/Footer/Footer';
import ClaimsFormComponent from '@/Components/Claims/ClaimsFormComponent/ClaimsFormComponent';
import styles from './ClaimsForm.module.css';

export default function ClaimsForm() {
    return (
        <div className={styles.root}>
            <Head title="Formulario de Reclamaciones - MiKiwi" />
            <Header />

            <main className={styles.main}>
                {/* Breadcrumb */}
                <nav className={styles.breadcrumb}>
                    <Link href={route('home')} className={styles.breadcrumbLink}>Inicio</Link>
                    <span>/</span>
                    <span className={styles.breadcrumbCurrent}>Formulario de Reclamaciones</span>
                </nav>

                <h1 className={styles.title}>
                    Formulario de Reclamaciones
                </h1>
                <p className={styles.intro}>
                    En MiKiwi nos preocupamos por tu satisfacción. Si tienes alguna incidencia, estamos aquí para ayudarte.
                </p>

                <ClaimsFormComponent />
            </main>

            <Footer />
        </div>
    );
}
