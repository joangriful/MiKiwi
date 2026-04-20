import { Link } from '@inertiajs/react';
import styles from './FooterLinks.module.css';

const sections = [
    {
        title: 'Tienda',
        links: [
            { href: route('products.index'), label: 'Mis productos' },
            {
                href: route('doll.config.test'),
                label: 'Personalizar muñecas',
            },
        ],
    },
    {
        title: 'Sobre Nosotros',
        links: [
            { href: route('about-us'), label: 'Sobre Nosotros' },
            { href: route('sustainability'), label: 'Sostenibilidad' },
            { href: route('faq'), label: 'Preguntas frecuentes' },
            { href: route('contacto'), label: 'Contacto' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { href: route('legal.notice'), label: 'Aviso Legal' },
            {
                href: route('privacy.policy'),
                label: 'Política de Privacidad',
            },
            { href: route('terms.use'), label: 'Términos de Uso' },
            { href: route('cookie.policy'), label: 'Política de Cookies' },
            {
                href: route('terms.contract'),
                label: 'Condiciones de Contratación',
            },
            {
                href: route('claims.form'),
                label: 'Formulario de Reclamaciones',
            },
        ],
    },
];

export default function FooterLinks() {
    return (
        <div className={styles.root}>
            {sections.map((section) => (
                <section key={section.title} className={styles.section}>
                    <h3 className={styles.title}>{section.title}</h3>
                    <ul className={styles.list}>
                        {section.links.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} className={styles.link}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    );
}
