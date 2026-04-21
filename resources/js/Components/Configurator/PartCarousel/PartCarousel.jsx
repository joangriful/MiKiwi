import PartOption from '../PartOption/PartOption';
import styles from './PartCarousel.module.css';

function createCategoryIcon(pathNodes) {
    return (
        <svg
            className={styles.categoryIcon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            {pathNodes}
        </svg>
    );
}

const CATEGORY_ICONS = {
    pelo: createCategoryIcon(
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 4a2 2 0 012-2h12a2 2 0 012 2v1m-16 0v14a2 2 0 002 2h12a2 2 0 002-2V5m-16 0h16"
        />
    ),
    ojos: createCategoryIcon(
        <>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
        </>
    ),
    cejas: createCategoryIcon(
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M5 10c0-1.657 3.134-3 7-3s7 1.343 7 3"
        />
    ),
    boca: createCategoryIcon(
        <>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14.828 14.828a4 4 0 01-5.656 0"
            />
            <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
        </>
    ),
    nariz: createCategoryIcon(
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 15c1.5 0 3-.5 3-2.5V8"
        />
    ),
    orejas: createCategoryIcon(
        <>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19.027 15.023c0 1.1-1.34 2.1-3.34 2.1m-12.027-3c1.1-1.1 2.1-1.34 2.1-3.34"
            />
            <path d="M11 11c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2" />
            <path d="M19 12c.5 0 1-.5 1-1V5c0-.5-.5-1-1-1H5c-.5 0-1 .5-1 1v6c0 .5.5 1 1 1" />
        </>
    ),
    manos: createCategoryIcon(
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0V12m-3 .5a3 3 0 006 0v-1a1.5 1.5 0 10-3 0m0 1V5.5a1.5 1.5 0 10-3 0v4"
        />
    ),
    pies: createCategoryIcon(
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 17h6c2 0 3-1 3-3V6c0-2-1-3-3-3H3m18 14h-6c-2 0-3-1-3-3V6c0-2 1-3 3-3h6"
        />
    ),
    vientre: createCategoryIcon(
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 12c-3-3-3-9 0-9s3 6 0 9zm0 0c3 3 3 9 0 9s-3-6 0-9z"
        />
    ),
    pechos: createCategoryIcon(
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
    ),
    vello: createCategoryIcon(
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
        />
    ),
    ropa: createCategoryIcon(
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        />
    ),
    default: createCategoryIcon(
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"
        />
    ),
};

const CATEGORY_LABELS = {
    armLeft: 'Brazo izquierdo',
    armRight: 'Brazo derecho',
    head: 'Cabeza',
    legLeft: 'Pierna izquierda',
    legRight: 'Pierna derecha',
    torso: 'Torso',
};

function getClassName(...classNames) {
    return classNames.filter(Boolean).join(' ');
}

export default function PartCarousel({
    category,
    items,
    selectedItem,
    onSelect,
    index,
    id,
    selectionLabel,
    partPositions,
    currentView,
    onSavePosition,
    isOpen,
    onToggle,
    ...props
}) {
    const categoryLabel = CATEGORY_LABELS[category] ?? category;

    const handleKeyDown = (event, item) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();

            const container = event.currentTarget.closest(
                '[data-carousel-root="true"]'
            );

            if (!container) {
                return;
            }

            const buttons = Array.from(container.querySelectorAll('button'));
            const currentIndex = buttons.indexOf(event.currentTarget);

            if (currentIndex === -1) {
                return;
            }

            let nextIndex = currentIndex;

            if (event.key === 'ArrowRight') {
                nextIndex = currentIndex + 1 >= buttons.length ? 0 : currentIndex + 1;
            } else {
                nextIndex = currentIndex - 1 < 0 ? buttons.length - 1 : currentIndex - 1;
            }

            buttons[nextIndex].focus();

            if (nextIndex === 0) {
                onSelect(null);
                return;
            }

            const itemToSelect = items[nextIndex - 1];

            if (itemToSelect) {
                onSelect(itemToSelect);
            }
        }

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelect(item);

            const nextCarouselId = `carousel-${index + 1}`;
            const nextCarousel = document.getElementById(nextCarouselId);

            if (!nextCarousel) {
                return;
            }

            const firstButton = nextCarousel.querySelector('button');

            if (firstButton) {
                firstButton.focus();
                firstButton.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
        }
    };

    return (
        <div id={id} className={styles.root}>
            <button
                onClick={onToggle}
                className={styles.headerButton}
                aria-expanded={isOpen}
            >
                <div className={styles.headerContent}>
                    <div
                        className={getClassName(
                            styles.iconBadge,
                            isOpen ? styles.iconBadgeOpen : ''
                        )}
                    >
                        {CATEGORY_ICONS[category.toLowerCase()] ??
                            CATEGORY_ICONS.default}
                    </div>

                    <span
                        className={getClassName(
                            styles.title,
                            isOpen ? styles.titleOpen : ''
                        )}
                    >
                        {categoryLabel}
                    </span>
                </div>

                <svg
                    className={getClassName(
                        styles.chevron,
                        isOpen ? styles.chevronOpen : ''
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                </svg>
            </button>

            {isOpen ? (
                <div className={styles.panel} data-carousel-root="true">
                    <div className={styles.scrollRow}>
                        <button
                            onClick={() => onSelect(null)}
                            onKeyDown={(event) => handleKeyDown(event, null)}
                            className={getClassName(
                                styles.clearButton,
                                !selectedItem ? styles.clearButtonSelected : ''
                            )}
                            title={`Quitar ${categoryLabel}`}
                        >
                            <span className={styles.clearIcon}>✕</span>
                            <span className={styles.clearLabel}>Ninguno</span>
                        </button>

                        {items.map((item) => (
                            <div key={item.id} className={styles.optionWrapper}>
                                <PartOption
                                    item={item}
                                    isSelected={selectedItem?.id === item.id}
                                    onSelect={onSelect}
                                    onKeyDown={(event) =>
                                        handleKeyDown(event, item)
                                    }
                                    selectionLabel={selectionLabel}
                                    showImages={props.showImages}
                                    onEdit={
                                        props.onEdit
                                            ? (part) => props.onEdit(category, part)
                                            : undefined
                                    }
                                    partPositions={partPositions}
                                    currentView={currentView}
                                    category={category}
                                    onSavePosition={onSavePosition}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
