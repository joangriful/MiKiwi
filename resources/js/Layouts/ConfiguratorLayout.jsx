import Header from '@/Components/Header/Header';
import Footer from '@/Components/Footer/Footer';
import styles from './ConfiguratorLayout.module.css';

export default function ConfiguratorLayout({ children }) {
    return (
        <div className={styles.root}>
            <div>
                <Header />
                <main>
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}
