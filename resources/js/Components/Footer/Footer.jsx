import FooterBottom from './FooterBottom/FooterBottom';
import FooterLinks from './FooterLinks/FooterLinks';
import FooterLogo from './FooterLogo/FooterLogo';
import FooterNewsletter from './FooterNewsletter/FooterNewsletter';
import FooterSocial from './FooterSocial/FooterSocial';
import styles from './Footer.module.css';

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
        </footer>
    );
}
