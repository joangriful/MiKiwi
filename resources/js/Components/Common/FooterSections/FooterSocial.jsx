export default function FooterSocial() {
    return (
        <div className="flex gap-4">
            <a href="#" className="flex items-center justify-center p-3 rounded-full hover:bg-white transition-all group border border-transparent hover:border-white/50">
                <img src="/assets/icons/github.svg" alt="GitHub" className="h-6 w-6 invert brightness-0 group-hover:filter-none transition-all" />
            </a>
            <a href="#" className="flex items-center justify-center p-3 rounded-full hover:bg-white transition-all group border border-transparent hover:border-white/50">
                <img src="/assets/icons/linkedin.svg" alt="LinkedIn" className="h-6 w-6 invert brightness-0 group-hover:filter-none transition-all" />
            </a>
            <a href="#" className="flex items-center justify-center p-3 rounded-full hover:bg-white transition-all group border border-transparent hover:border-white/50">
                <img src="/assets/icons/gmail.svg" alt="Gmail" className="h-6 w-6 invert brightness-0 group-hover:filter-none transition-all" />
            </a>
        </div>
    );
}
