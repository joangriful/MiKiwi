import ScrollReveal from '@/Utils/ScrollReveal';
import { HOME_KEYWORDS } from '@/Components/Home/utils/homeContent';
import styles from './KeywordsSection.module.css';

export default function KeywordsSection() {
    return (
        <ScrollReveal direction="right" distance={50} delay={0.2}>
            <section className={styles.root} aria-label="Valores MiKiwi">
                <p className={styles.keywords}>
                    {HOME_KEYWORDS.map((keyword) => (
                        <span key={keyword}>{keyword}</span>
                    ))}
                </p>
            </section>
        </ScrollReveal>
    );
}
