import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

import styles from './HeroSection.module.css';

export default function HeroSection() {
    return (
        <section className={styles.root}>
            <div className={styles.content}>
                <div className={styles.split}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className={styles.logoWrap}
                    >
                        <img
                            src="/assets/icons/mikiwi_logo.svg"
                            alt="MiKiwi Logo"
                            width="632"
                            height="248"
                            decoding="async"
                            className={styles.logo}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className={styles.textSide}
                    >
                        <h1 className={styles.slogan}>
                            Ingeniería sensorial + diseño<br />
                            exclusivo para elevar tu placer.
                        </h1>
                        <div className={styles.ctaBox}>
                            <Link href={route('register')} className={styles.cta}>
                                ÚNETE A MIKIWI
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
