
import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";
import ProfileSidebar from "@/Components/Profile/ProfileSidebar/ProfileSidebar";
import ProfileTab from "@/Components/Profile/ProfileTab/ProfileTab";
import AddressesTab from "@/Components/Profile/AddressesTab/AddressesTab";
import OrderHistoryTab from "@/Components/Profile/OrderHistoryTab/OrderHistoryTab";
import EditAccountTab from "@/Components/Profile/EditAccountTab/EditAccountTab";
import CardsTab from "@/Components/Profile/CardsTab/CardsTab";
import PreferencesTab from "@/Components/Profile/PreferencesTab/PreferencesTab";
import ReturnsTab from "@/Components/Profile/ReturnsTab/ReturnsTab";
import { Head } from '@inertiajs/react';
import { useState } from "react";
import styles from "./Profile.module.css";

export default function Profile({ recommendedProducts, orders = [], initialTab = 'profile' }) {
    const [activeTab, setActiveTab] = useState(initialTab);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileTab setActiveTab={setActiveTab} recommendedProducts={recommendedProducts} />;
            case 'addresses':
                return <AddressesTab />;
            case 'orders':
                return <OrderHistoryTab orders={orders} />;
            case 'edit-account':
                return <EditAccountTab />;
            case 'cards': // Added Case
                return <CardsTab />;
            case 'preferences':
                return <PreferencesTab />;
            case 'returns':
                return <ReturnsTab />;
            default:
                return <ProfileTab recommendedProducts={recommendedProducts} />;
        }
    };

    return (
        <div className={`${styles.root} flex flex-col font-sans select-none cursor-default bg-gray-50/50`}>
            <Head title="Mi Perfil - MiKiwi" />

            <div className="flex flex-col min-h-[98vh]">
                <Header />
                <main className="flex-1 flex flex-col lg:flex-row text-gray-800">
                    {/* Sidebar de navegación */}
                    <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                    {/* Contenido principal dinámico */}
                    <section className="flex-1 bg-gray-50/50 p-6 lg:p-10 overflow-y-auto">
                        <div className="w-full">
                            {renderTabContent()}
                        </div>
                    </section>
                </main>
            </div>

            <Footer />
        </div>
    );
}
