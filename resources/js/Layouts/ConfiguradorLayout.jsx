import React from 'react';
import Header from '@/Components/Configurador/Header';
import Footer from '@/Components/Configurador/Footer';
import '../../css/configurador.css';

export default function ConfiguradorLayout({ children }) {
    return (
        <div className="configurador-wrapper">
            <Header />
            <main>
                {children}
            </main>
            <Footer />

            {/* Injecting fonts locally if needed, though they should be in the main app layout or imported here */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
            `}} />
        </div>
    );
}
