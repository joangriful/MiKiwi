import { useForm } from '@inertiajs/react';
import { toast } from 'react-toastify';
import styles from './FooterNewsletter.module.css';

export default function FooterNewsletter() {
    const { data, setData, post, processing, reset, errors } = useForm({
        email: '',
        gender: 'pene', // Default or could be blank, but controller expects it for the message
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('newsletter.subscribe'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('¡Gracias por suscribirte!');
                reset();
            },
            onError: (err) => {
                toast.error(err.newsletter || 'Error al procesar la suscripción');
            }
        });
    };

    return (
        <div className={styles.root}>
            <div className={styles.copyBlock}>
                <h4 className={styles.title}>
                    Únete al círculo exclusivo de MiKiwi
                </h4>
                <p className={styles.subtitle}>
                    Recibe ofertas especiales y recetas frescas.
                </p>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="Tu correo electrónico"
                    required
                    className={styles.input}
                    disabled={processing}
                />
                <button
                    type="submit"
                    disabled={processing}
                    className={styles.button}
                >
                    {processing ? 'Enviando...' : 'Suscribirse'}
                </button>
            </form>
            {errors.email ? (
                <p className={styles.error}>{errors.email}</p>
            ) : null}
        </div>
    );
}
