import Header from '@/Components/Header/Header';
import Footer from '@/Components/Footer/Footer';

export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
        </div>
    );
}
