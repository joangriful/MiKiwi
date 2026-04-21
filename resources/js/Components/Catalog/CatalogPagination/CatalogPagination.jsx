import { Link } from '@inertiajs/react';
import styles from './CatalogPagination.module.css';

function cleanPaginationLabel(label) {
    return label.replace('Previous', '').replace('Next', '');
}

export default function CatalogPagination({ links = [] }) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <nav className={styles.root} aria-label="Paginacion del catalogo">
            <div className={styles.list}>
                {links.map((link, index) => {
                    const label = cleanPaginationLabel(link.label);

                    if (link.url === null) {
                        return (
                            <span
                                key={`${label}-${index}`}
                                className={styles.disabledItem}
                                dangerouslySetInnerHTML={{ __html: label }}
                            />
                        );
                    }

                    return (
                        <Link
                            key={`${label}-${index}`}
                            href={link.url}
                            className={`${styles.item} ${link.active ? styles.itemActive : styles.itemInactive}`}
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    );
                })}
            </div>
        </nav>
    );
}
