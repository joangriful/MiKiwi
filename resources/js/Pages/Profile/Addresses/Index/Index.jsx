import AddressesTab from '@/Components/Profile/AddressesTab/AddressesTab';
import { Head } from '@inertiajs/react';
import styles from './Index.module.css';

export default function Index() {
    return (
        <div className={styles.root}>
            <Head title="Direcciones" />
            <AddressesTab />
        </div>
    );
}
