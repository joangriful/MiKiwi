import { Link } from "@inertiajs/react";
import { getProductImage } from "@/Components/Checkout/utils/productImages";
import styles from "./CheckoutOrderSummary.module.css";

export default function CheckoutOrderSummary({
    cart,
    coupon,
    couponCode,
    onCouponCodeChange,
    onApplyCoupon,
    onRemoveCoupon,
    onRemoveItem,
    onCheckout,
    canCheckout,
    isBuyNow,
    step,
    totals,
}) {
    return (
        <aside className={styles.root} aria-label="Resumen del pedido">
            <div className={styles.sticky}>
                <SummaryHeader isBuyNow={isBuyNow} />

                <div className={styles.itemList}>
                    {cart.items.length > 0 ? (
                        cart.items.map((item) => (
                            <OrderSummaryItem key={item.product_id} item={item} onRemoveItem={onRemoveItem} />
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <p>Carrito vacio</p>
                        </div>
                    )}
                </div>

                <CouponBox
                    coupon={coupon}
                    couponCode={couponCode}
                    onCouponCodeChange={onCouponCodeChange}
                    onApplyCoupon={onApplyCoupon}
                    onRemoveCoupon={onRemoveCoupon}
                />

                <TotalsBox
                    coupon={coupon}
                    step={step}
                    totals={totals}
                    onCheckout={onCheckout}
                    canCheckout={canCheckout}
                />
            </div>
        </aside>
    );
}

function SummaryHeader({ isBuyNow }) {
    return (
        <div className={styles.header}>
            <div>
                <h3 className={styles.title}>Tu Pedido</h3>
                <div className={styles.accent} />
            </div>

            {isBuyNow ? (
                <Link href={route("cart.index")} className={styles.editLink}>
                    Editar Cesta
                </Link>
            ) : null}
        </div>
    );
}

function OrderSummaryItem({ item, onRemoveItem }) {
    const lineTotal = (Number.parseFloat(item.product.base_price) * item.quantity).toFixed(2);

    return (
        <div className={styles.item}>
            <Link href={route("products.show", item.product.slug)} className={styles.imageLink}>
                <img src={getProductImage(item.product)} alt={item.product.name} className={styles.image} />
                <span className={styles.quantity}>{item.quantity}</span>
            </Link>

            <div className={styles.itemInfo}>
                <Link href={route("products.show", item.product.slug)} className={styles.itemName}>
                    {item.product.name}
                </Link>
                <div className={styles.itemMeta}>
                    <p>REF: {item.product.sku || "N/A"}</p>
                    <button type="button" onClick={() => onRemoveItem(item.product_id)} className={styles.removeButton}>
                        Quitar
                    </button>
                </div>
            </div>

            <div className={styles.lineTotal}>{lineTotal} €</div>
        </div>
    );
}

function CouponBox({ coupon, couponCode, onCouponCodeChange, onApplyCoupon, onRemoveCoupon }) {
    return (
        <section className={styles.couponSection}>
            <label className={styles.couponLabel} htmlFor="checkout_coupon">
                Cupon de descuento
            </label>
            <div className={styles.couponInputGroup}>
                <input
                    id="checkout_coupon"
                    type="text"
                    placeholder="Tengo un codigo..."
                    className={styles.couponInput}
                    value={couponCode}
                    aria-label="Código de cupón"
                    onChange={(event) => onCouponCodeChange(event.target.value)}
                />
                <button type="button" onClick={onApplyCoupon} className={styles.couponButton}>
                    Validar
                </button>
            </div>

            {coupon ? (
                <div className={styles.appliedCoupon}>
                    <div className={styles.appliedCouponContent}>
                        <div className={styles.appliedCouponIcon}>
                            <svg className={styles.iconSm} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <span className={styles.appliedCouponCode}>{coupon.code}</span>
                            <span className={styles.appliedCouponMeta}>
                                Descuento aplicado (-{coupon.type === "percent" ? `${coupon.value}%` : `${coupon.value} €`})
                            </span>
                        </div>
                    </div>

                    <button type="button" onClick={onRemoveCoupon} className={styles.removeCouponButton} aria-label="Quitar cupon">
                        <svg className={styles.iconMd} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ) : null}
        </section>
    );
}

function TotalsBox({ coupon, step, totals, onCheckout, canCheckout }) {
    return (
        <section className={styles.totalsSection}>
            <SummaryRow label="Subtotal" value={`${totals.subtotal.toFixed(2)} €`} />

            {coupon ? (
                <SummaryRow
                    label="Ahorro cupon"
                    value={`-${totals.couponDiscount.toFixed(2)} €`}
                    variant="discount"
                />
            ) : null}

            <SummaryRow
                label="Gastos Envio"
                value={
                    step > 2 ? (
                        `${totals.shippingCost.toFixed(2)} €`
                    ) : (
                        <span className={styles.pendingShipping}>pendiente de envio</span>
                    )
                }
            />

            <div className={styles.finalTotalRow}>
                <div>
                    <span className={styles.finalTotalLabel}>Total Final</span>
                    <p className={styles.taxText}>IVA Incluido</p>
                </div>
                <div className={styles.finalTotal}>
                    {totals.finalTotal.toFixed(2)}
                    <span>€</span>
                </div>
            </div>

            {step === 1 ? (
                <button
                    type="button"
                    onClick={onCheckout}
                    className={styles.checkoutButton}
                    disabled={!canCheckout}
                    aria-disabled={!canCheckout}
                >
                    <span>Pagar ahora</span>
                    <svg className={styles.iconMd} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            ) : null}
        </section>
    );
}

function SummaryRow({ label, value, variant }) {
    const isDiscount = variant === "discount";

    return (
        <div className={styles.summaryRow}>
            <span className={isDiscount ? styles.discountLabel : styles.summaryLabel}>{label}</span>
            <span className={isDiscount ? styles.discountValue : styles.summaryValue}>{value}</span>
        </div>
    );
}
