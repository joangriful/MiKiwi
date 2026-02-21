import FooterLogo from './FooterSections/FooterLogo';
import FooterLinks from './FooterSections/FooterLinks';
import FooterSocial from './FooterSections/FooterSocial';
import FooterNewsletter from './FooterSections/FooterNewsletter';
import FooterBottom from './FooterSections/FooterBottom';

export default function Footer() {
    return (
        <footer className="bg-black text-white pt-16 pb-8 border-t border-gray-800 overflow-hidden relative">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-12 lg:gap-32 gap-12">
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
        </footer>
    );
}
