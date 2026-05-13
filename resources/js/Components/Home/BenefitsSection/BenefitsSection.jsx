import ScrollReveal from '@/Utils/ScrollReveal';
import { HOME_BENEFITS } from '@/Components/Home/utils/homeContent';
import { getCloudinaryUrl } from '@/Utils/cloudinary';
import styles from './BenefitsSection.module.css';

export default function BenefitsSection() {
    return (
        <section className={styles.root} aria-label="Ventajas de MiKiwi">
            <div className={styles.grid}>
                {HOME_BENEFITS.map((benefit, index) => (
                    <ScrollReveal key={benefit.title} direction="up" delay={index * 0.15}>
                        <article className={styles.card}>
                            <div className={styles.imageWrap}>
                                <img
                                    src={getCloudinaryUrl(benefit.image, { transformations: 'f_auto,q_auto,w_460,h_460,c_fill' })}
                                    alt={benefit.title}
                                    width="460"
                                    height="460"
                                    loading="lazy"
                                    decoding="async"
                                    className={styles.image}
                                />
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
