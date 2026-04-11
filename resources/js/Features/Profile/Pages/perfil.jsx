
import Header from "@/Components/Common/Header/Header";
import Footer from "@/Components/Common/Footer/Footer";
import { useState } from "react";
import { Head } from '@inertiajs/react';
import ProfileSidebar from "@/Features/Profile/Components/ProfileSidebar/ProfileSidebar";
import ProfileTab from "@/Features/Profile/Components/Tabs/ProfileTab/ProfileTab";
import OrderHistoryTab from "@/Features/Profile/Components/Tabs/OrderHistoryTab/OrderHistoryTab";
import EditAccountTab from "@/Features/Profile/Components/Tabs/EditAccountTab/EditAccountTab";
import CardsTab from "@/Features/Profile/Components/Tabs/CardsTab/CardsTab"; // Added Import
import PreferencesTab from "@/Features/Profile/Components/Tabs/PreferencesTab/PreferencesTab";
import ReturnsTab from "@/Features/Profile/Components/Tabs/ReturnsTab/ReturnsTab";

export default function Perfil({ recommendedProducts, orders = [], initialTab = 'profile' }) {
    const [activeTab, setActiveTab] = useState(initialTab);

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

