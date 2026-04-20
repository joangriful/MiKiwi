import styles from './FooterSocial.module.css';

const socialLinks = [
    {
        href: 'https://github.com/joangriful/MiKiwi',
        label: 'GitHub',
        icon: '/assets/icons/github.svg',
    },
    {
        href: 'https://www.instagram.com/_mikiwi',
        label: 'Instagram',
        icon: '/assets/icons/instagram.svg',
    },
    {
        href: 'mailto:mikiwi.toys@gmail.com',
        label: 'Gmail',
        icon: '/assets/icons/gmail.svg',
    },
];

export default function FooterSocial() {
    return (
        <div className={styles.root}>
            {socialLinks.map((link) => (
                <a
                    key={link.href}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={
                        link.href.startsWith('http')
                            ? 'noopener noreferrer'
                            : undefined
                    }
                    className={styles.link}
                >
                    <img
                        src={link.icon}
                        alt={link.label}
                        className={styles.icon}
                    />
                </a>
            ))}
        </div>
    );
}
