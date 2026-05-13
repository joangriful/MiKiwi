import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";
import ProfileSidebar from "@/Components/Profile/ProfileSidebar/ProfileSidebar";
import ProfileTab from "@/Components/Profile/ProfileTab/ProfileTab";
import FavoritesTab from "@/Components/Profile/FavoritesTab/FavoritesTab";
import AddressesTab from "@/Components/Profile/AddressesTab/AddressesTab";
import OrderHistoryTab from "@/Components/Profile/OrderHistoryTab/OrderHistoryTab";
import EditAccountTab from "@/Components/Profile/EditAccountTab/EditAccountTab";
import CardsTab from "@/Components/Profile/CardsTab/CardsTab";
import ReturnsTab from "@/Components/Profile/ReturnsTab/ReturnsTab";
import { Head } from '@inertiajs/react';
import { useState } from "react";
import styles from "./Profile.module.css";

export default function Profile({ recommendedProducts, favoriteProducts = [], orders = [], initialTab = 'profile' }) {
    const [activeTab, setActiveTab] = useState(initialTab);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileTab setActiveTab={setActiveTab} recommendedProducts={recommendedProducts} />;
            case 'favorites':
                return <FavoritesTab favoriteProducts={favoriteProducts} />;
            case 'addresses':
                return <AddressesTab />;
            case 'orders':
                return <OrderHistoryTab orders={orders} />;
            case 'edit-account':
                return <EditAccountTab />;
            case 'cards':
                return <CardsTab />;
            case 'returns':
                return <ReturnsTab />;
            default:
                return <ProfileTab setActiveTab={setActiveTab} recommendedProducts={recommendedProducts} />;
        }
    };

    return (
        <div className={styles.root}>
            <Head title="Mi Perfil - MiKiwi" />

            <div className={styles.shell}>
                <Header />
                <main className={styles.main}>
                    <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                    <section className={styles.content}>
                        <div className={styles.contentInner}>
                            {renderTabContent()}
                        </div>
                    </section>
                </main>
            </div>

            <Footer />
        </div>
    );
}
