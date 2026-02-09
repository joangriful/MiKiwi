
import Header from "@/Components/Common/Header";
import Footer from "@/Components/Common/Footer";
import { useState } from "react";
import { Head } from '@inertiajs/react';
import ProfileSidebar from "@/Components/Profile/ProfileSidebar";
import ProfileTab from "@/Components/Profile/Tabs/ProfileTab";
import LevelTab from "@/Components/Profile/Tabs/LevelTab";
import OrderHistoryTab from "@/Components/Profile/Tabs/OrderHistoryTab";
import EditAccountTab from "@/Components/Profile/Tabs/EditAccountTab";
import CardsTab from "@/Components/Profile/Tabs/CardsTab"; // Added Import
import PreferencesTab from "@/Components/Profile/Tabs/PreferencesTab";
import ReturnItemTab from "@/Components/Profile/Tabs/ReturnItemTab";
import ReturnsTab from "@/Components/Profile/Tabs/ReturnsTab";
import AddressesTab from "@/Components/Profile/Tabs/AddressesTab";
import NewslettersTab from "@/Components/Profile/Tabs/NewslettersTab";
import LikesTab from "@/Components/Profile/Tabs/LikesTab";

export default function Perfil() {
    const [activeTab, setActiveTab] = useState('profile');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileTab setActiveTab={setActiveTab} />;
            case 'level':
                return <LevelTab />;
            case 'orders':
                return <OrderHistoryTab />;
            case 'edit-account':
                return <EditAccountTab />;
            case 'cards': // Added Case
                return <CardsTab />;
            case 'preferences':
                return <PreferencesTab />;
            case 'return-item':
                return <ReturnItemTab />;
            case 'returns':
                return <ReturnsTab />;
            case 'addresses':
                return <AddressesTab />;
            case 'newsletters':
                return <NewslettersTab />;
            case 'likes':
                return <LikesTab />;
            default:
                return <ProfileTab />;
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


