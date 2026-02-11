import React from 'react';
import Header from '@/Components/Common/Header';
import Footer from '@/Components/Common/Footer';
import SubHeader from '@/Components/Common/SubHeader';
import '../../css/configurador.css';

export default function ConfiguradorLayout({ children, transparentSubHeader = false }) {
    return (
        <div className="min-h-screen flex flex-col justify-between cursor-default select-none">
            <div>
                <Header />
                <SubHeader transparent={transparentSubHeader} />
                <main>
                    {children}
                </main>
            </div>
            <Footer />

            {/* Injecting fonts locally if needed, though they should be in the main app layout or imported here */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
            `}} />
        </div>
    );
}
