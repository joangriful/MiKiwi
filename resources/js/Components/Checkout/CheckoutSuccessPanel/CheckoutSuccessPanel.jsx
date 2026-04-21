import { Link } from "@inertiajs/react";
import styles from "./CheckoutSuccessPanel.module.css";

export default function CheckoutSuccessPanel() {
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
