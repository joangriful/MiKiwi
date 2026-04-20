import MikiwiLogo from '@/Components/MikiwiLogo/MikiwiLogo';
import styles from './FooterLogo.module.css';

export default function FooterLogo() {
    return (
        <div className={styles.root}>
            <MikiwiLogo className={styles.logo} />
        </div>
    );
}
