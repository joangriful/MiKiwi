import FooterLogo from '../FooterSections/FooterLogo/FooterLogo';
import FooterLinks from '../FooterSections/FooterLinks/FooterLinks';
import FooterSocial from '../FooterSections/FooterSocial/FooterSocial';
import FooterNewsletter from '../FooterSections/FooterNewsletter/FooterNewsletter';
import FooterBottom from '../FooterSections/FooterBottom/FooterBottom';
import './Footer.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Footer() {
    return (
        <footer className="bg-black text-white pt-16 pb-8 border-t border-gray-800 overflow-hidden relative">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start mb-12 lg:gap-32 gap-12">
                    <FooterLogo />
                    <FooterLinks />
                </div>

                {/* Social & Newsletter Row */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 pb-12 mb-8 border-b border-gray-800">
                    <FooterSocial />
                    <FooterNewsletter />
                </div>

                <FooterBottom />
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </footer>
    );
}
