import ScrollReveal from '@/Utils/ScrollReveal';
import { HOME_BENEFITS } from '@/Components/Home/utils/homeContent';
import styles from './BenefitsSection.module.css';

export default function BenefitsSection() {
    return (
        <section className={styles.root} aria-label="Ventajas de MiKiwi">
            <div className={styles.grid}>
                {HOME_BENEFITS.map((benefit, index) => (
                    <ScrollReveal key={benefit.title} direction="up" delay={index * 0.15}>
                        <article className={styles.card}>
                            <div className={styles.imageWrap}>
                                <img src={benefit.image} alt={benefit.title} className={styles.image} />
                            </div>
                            <h3 className={styles.title}>{benefit.title}</h3>
                            <p className={styles.description}>{benefit.description}</p>
                        </article>
                    </ScrollReveal>
                ))}
            </div>
        </section>
    );
}
