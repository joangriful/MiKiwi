import { Link } from "@inertiajs/react";
import styles from "./CheckoutSuccessPanel.module.css";

export default function CheckoutSuccessPanel({ orderId }) {
    return (
        <section className={styles.root} aria-labelledby="checkout_success_title">
            <div className={styles.iconWrapper}>
                <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <h1 id="checkout_success_title" className={styles.title}>
                Pedido realizado
            </h1>
            <p className={styles.text}>
                Tu pedido ha sido procesado correctamente. Recibiras un correo de confirmacion en breve.
            </p>

            <div className={styles.actions}>
                {orderId && (
                    <a 
                        href={route("orders.invoice", orderId)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.invoiceAction}
                    >
                        <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Descargar Factura
                    </a>
                )}
                <Link href={route("perfil.view")} className={styles.primaryAction}>
                    Ver mis pedidos
                </Link>
                <Link href={route("products.index")} className={styles.secondaryAction}>
                    Seguir comprando
                </Link>
            </div>
        </section>
    );
}
