import { Head } from '@inertiajs/react';
import CheckoutSuccessPanel from '@/Components/Checkout/CheckoutSuccessPanel/CheckoutSuccessPanel';
import Header from '@/Components/Header/Header';
import Footer from '@/Components/Footer/Footer';
import styles from './Success.module.css';

export default function Success({ orderId }) {
    return (
        <div className={styles.root}>
            <Head title="Pedido Completado - MiKiwi" />
            <Header />

            <main className={styles.main}>
                <CheckoutSuccessPanel orderId={orderId} />
            </main>

            <Footer />
        </div>
    );
}
