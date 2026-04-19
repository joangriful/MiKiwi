import styles from './ConfiguratorTheme.module.css';

export default function ConfiguratorLayout({ children }) {
    return (
        <div className={`${styles.root} cursor-default select-none`}>
            <main>{children}</main>

            {/* Injecting fonts locally if needed, though they should be in the main app layout or imported here */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
            `}} />
        </div>
    );
}
