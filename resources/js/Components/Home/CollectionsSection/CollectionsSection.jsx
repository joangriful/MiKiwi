import { Link } from '@inertiajs/react';

import ScrollReveal from '@/Utils/ScrollReveal';
import { HOME_COLLECTIONS } from '@/Components/Home/utils/homeContent';
import styles from './CollectionsSection.module.css';

function normalizeCollectionImages(collectionImages) {
    if (!Array.isArray(collectionImages) || collectionImages.length === 0) {
        return HOME_COLLECTIONS;
    }

    return HOME_COLLECTIONS.map((collection, index) => {
        const managedImage = collectionImages[index];

        return {
            ...collection,
            image: managedImage?.url ?? collection.image,
        };
    });
}

export default function CollectionsSection({ collectionImages = [] }) {
    const collections = normalizeCollectionImages(collectionImages);

    return (
        <section className={styles.root}>
            <ScrollReveal direction="right">
                <div className={styles.header}>
                    <h2 className={styles.title}>Colecciones.</h2>
                    <div className={styles.headerText}>
                        <p className={styles.description}>Universos sensoriales cuidadosamente curados por MiKiwi.</p>
                        <Link href={route('products.index')} className={styles.cta}>Ver todas</Link>
                    </div>
                </div>
            </ScrollReveal>

            <div className={styles.grid}>
                {collections.map((collection, index) => (
                    <ScrollReveal key={collection.category} direction="left" delay={index * 0.1} distance={30}>
                        <Link href={route('products.index', { category: collection.category })} className={styles.item}>
                            <div className={styles.imageBox}>
                                <img src={collection.image} alt={collection.title} className={styles.image} />
                            </div>
                            <h3 className={styles.collectionTitle}>{collection.title}</h3>
                        </Link>
                    </ScrollReveal>
                ))}
            </div>
        </section>
    );
}
