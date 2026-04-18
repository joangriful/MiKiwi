import React, { useState } from 'react';
import HeroImageManager from '../HeroImageManager/HeroImageManager';
import styles from './ContentManager.module.css';

const HERO_SECTION = 'hero';

const CONTENT_SECTIONS = [
    {
        id: HERO_SECTION,
        label: 'Hero',
        icon: 'image',
    },
];

const HERO_IMAGE_GROUPS = [
    {
        key: 'home',
        title: 'Imágenes del Hero (Home)',
        description: 'Gestiona las imágenes de fondo del hero principal',
        uploadType: 'home',
        matchesType: (image) => image.type === 'home' || !image.type,
    },
    {
        key: 'sustainability',
        title: 'Imágenes del Hero (Sostenibilidad)',
        description: 'Gestiona las imágenes del hero de la página de sostenibilidad',
        uploadType: 'sustainability',
        matchesType: (image) => image.type === 'sustainability',
    },
    {
        key: 'dolls',
        title: 'GIF / Imágenes Sección Muñecas (Home)',
        description: 'Gestiona el GIF de fondo que aparece en la sección Sex Dolls de la página principal',
        uploadType: 'dolls',
        matchesType: (image) => image.type === 'dolls',
    },
    {
        key: 'calibration',
        title: 'Fondo Sección Calibración (Home)',
        description: "Gestiona la imagen de fondo para la sección de 'Descubre tu personalidad'",
        uploadType: 'calibration',
        matchesType: (image) => image.type === 'calibration',
    },
];

export default function ContentManager({ heroImages }) {
    const [activeSection, setActiveSection] = useState(HERO_SECTION);

    return (
        <div className={styles.layout}>
            <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarTitle}>Contenido</h2>
                    <p className={styles.sidebarDescription}>Gestión de contenido del sitio</p>
                </div>

                <div className={styles.sidebarActions}>
                    {CONTENT_SECTIONS.map((section) => (
                        <button
                            key={section.id}
                            type="button"
                            onClick={() => setActiveSection(section.id)}
                            className={`${styles.sectionButton} ${activeSection === section.id ? styles.sectionButtonActive : ''}`}
                        >
                            <span className={`material-symbols-outlined ${styles.sectionButtonIcon}`}>{section.icon}</span>
                            {section.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.content}>
                {activeSection === HERO_SECTION && (
                    <div className={styles.heroManagers}>
                        {HERO_IMAGE_GROUPS.map((group) => (
                            <HeroImageManager
                                key={group.key}
                                images={heroImages.filter(group.matchesType)}
                                title={group.title}
                                description={group.description}
                                uploadType={group.uploadType}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
