import styles from './DollSelectionSummary.module.css';

function formatPrice(price) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
    }).format(price || 0);
}

function getDollDisplayName(dollProduct) {
    if (!dollProduct?.name || dollProduct.name === 'base_doll') {
        return 'Muñeca Personalizada';
    }

    return dollProduct.name;
}

export default function DollSelectionSummary({
    dollProduct,
    entries,
    totals,
    missingCategories,
    canPurchase,
    purchaseDisabledReason,
    purchaseErrorMessage,
    addedMessage,
    onReset,
    onAddToCart,
    onPurchase,
    isAddingToCart,
    isSubmitting,
}) {
    const isProcessing = isAddingToCart || isSubmitting;

    return (
        <section className={styles.root} aria-label="Resumen de muñeca personalizada">
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <p className={styles.eyebrow}>Resumen de configuración</p>
                    <h3 className={styles.title}>{getDollDisplayName(dollProduct)}</h3>

                    {missingCategories.length > 0 ? (
                        <div className={styles.warningBox}>
                            <p className={styles.warningTitle}>Faltan categorías obligatorias</p>
                            <p className={styles.warningText}>{missingCategories.join(', ')}</p>
                        </div>
                    ) : null}
                </div>
            </div>

            <div className={styles.list}>
                {entries.length > 0 ? entries.map((entry) => (
                    <div key={entry.key} className={styles.item}>
                        <div>
                            <p className={styles.itemCategory}>{entry.categoryLabel}</p>
                        </div>

                        {entry.hasSpecialPrice ? (
                            <span className={styles.itemPrice}>+{formatPrice(entry.extraPrice)}</span>
                        ) : (
                            <span className={styles.itemIncluded}>Incluido</span>
                        )}
                    </div>
                )) : (
                    <p className={styles.emptyState}>Empieza a seleccionar componentes para ver el desglose.</p>
                )}
            </div>

            <div className={styles.totals}>
                <div className={styles.totalRow}>
                    <span>Base</span>
                    <span>{formatPrice(totals.basePrice)}</span>
                </div>
                <div className={styles.totalRow}>
                    <span>Suplementos</span>
                    <span>{formatPrice(totals.extrasTotal)}</span>
                </div>
                <div className={`${styles.totalRow} ${styles.totalRowStrong}`}>
                    <span>Total</span>
                    <span>{formatPrice(totals.total)}</span>
                </div>
            </div>

            {purchaseDisabledReason ? (
                <p className={styles.statusText}>{purchaseDisabledReason}</p>
            ) : null}

            {purchaseErrorMessage ? (
                <p className={styles.statusText}>{purchaseErrorMessage}</p>
            ) : null}

            {addedMessage ? (
                <p className={styles.successText}>{addedMessage}</p>
            ) : null}

            <div className={styles.actions}>
                <button type="button" onClick={onReset} className={styles.resetButton} disabled={isProcessing}>
                    Borrar
                </button>
                <button
                    type="button"
                    onClick={onAddToCart}
                    className={styles.addToCartButton}
                    disabled={!canPurchase || isProcessing}
                >
                    {isAddingToCart ? 'Añadiendo...' : 'Añadir al carrito'}
                </button>
                <button
                    type="button"
                    onClick={onPurchase}
                    className={styles.purchaseButton}
                    disabled={!canPurchase || isProcessing}
                >
                    {isSubmitting ? 'Procesando...' : 'Comprar'}
                </button>
            </div>
        </section>
    );
}
