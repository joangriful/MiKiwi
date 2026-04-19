import { Link } from '@inertiajs/react';
import styles from './FooterBottom.module.css';

const bottomLinks = [
    { href: route('privacy.policy'), label: 'Política de Privacidad' },
    { href: route('terms.use'), label: 'Términos de Uso' },
];

export default function FooterBottom() {
    return (
        <div className={styles.root}>
            <p className={styles.copy}>
                &copy; 2026 MiKiwi Inc. Todos los derechos reservados.
            </p>
            <div className={styles.links}>
                {bottomLinks.map((link) => (
                    <Link key={link.href} href={link.href} className={styles.link}>
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
