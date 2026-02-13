import { Head } from '@inertiajs/react';
import { Home, Header, Footer } from '@/Components';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans select-none cursor-default">
            <Header />
            <main className="flex-grow">
                <Home />
            </main>
            <Footer />
        </div>
    );
}

