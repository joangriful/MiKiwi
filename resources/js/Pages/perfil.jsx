
import Header from "@/Components/Common/Header";
import Footer from "@/Components/Common/Footer";
import { useState } from "react";
import { Head } from '@inertiajs/react';
import ProfileSidebar from "@/Components/Profile/ProfileSidebar";
import ProfileTab from "@/Components/Profile/Tabs/ProfileTab";
import OrderHistoryTab from "@/Components/Profile/Tabs/OrderHistoryTab";
import EditAccountTab from "@/Components/Profile/Tabs/EditAccountTab";
import CardsTab from "@/Components/Profile/Tabs/CardsTab"; // Added Import
import PreferencesTab from "@/Components/Profile/Tabs/PreferencesTab";
import ReturnsTab from "@/Components/Profile/Tabs/ReturnsTab";
import AddressesTab from "@/Components/Profile/Tabs/AddressesTab";

export default function Perfil({ recommendedProducts, orders = [] }) {
    const [activeTab, setActiveTab] = useState('profile');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileTab setActiveTab={setActiveTab} recommendedProducts={recommendedProducts} />;
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
            case 'addresses':
                return <AddressesTab />;
            default:
                return <ProfileTab recommendedProducts={recommendedProducts} />;
        }
    };

    return (
        <div className="flex flex-col font-sans select-none cursor-default bg-gray-50/50">
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


