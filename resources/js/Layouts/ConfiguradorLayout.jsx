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
        </div>
    );
}
