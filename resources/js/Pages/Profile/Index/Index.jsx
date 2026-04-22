import HomeLogoLink from '@/Components/HomeLogoLink/HomeLogoLink';
import AddressesTab from '@/Components/Profile/AddressesTab/AddressesTab';
import { Head } from '@inertiajs/react';
import styles from './Index.module.css';

export default function Index() {
    return (
        <div className={styles.root}>
            <Head title="Direcciones" />
            <div className={styles.header}>
                <HomeLogoLink
                    className={styles.logoLink}
                    logoClassName={styles.logo}
                    size="sm"
                    ariaLabel="Volver al inicio desde direcciones"
                />
            </div>
            <AddressesTab />
        </div>
    );
}
