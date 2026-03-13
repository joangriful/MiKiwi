import MikiwiLogo from '@/Components/MikiwiLogo/MikiwiLogo';
import './FooterLogo.css';

export default function FooterLogo() {
    return (
        <div className="flex-1 mb-10 md:mb-0 flex justify-start">
            <MikiwiLogo
                className="w-48 md:w-64 h-auto text-white opacity-90 transition-transform hover:scale-105 duration-300"
            />
        </div>
    );
}

