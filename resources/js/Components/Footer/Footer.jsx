import FooterBottom from './FooterBottom/FooterBottom';
import FooterLinks from './FooterLinks/FooterLinks';
import FooterLogo from './FooterLogo/FooterLogo';
import FooterNewsletter from './FooterNewsletter/FooterNewsletter';
import FooterSocial from './FooterSocial/FooterSocial';
import styles from './Footer.module.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Footer() {
    return (
        <footer className={styles.root}>
            <div className={styles.container}>
                <div className={styles.topRow}>
                    <FooterLogo />
                    <FooterLinks />
                </div>

                <div className={styles.middleRow}>
                    <FooterSocial />
                    <FooterNewsletter />
                </div>

                <FooterBottom />
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </footer>
    );
}
