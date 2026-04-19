import { useEffect } from 'react';
import InputError from '@/Components/InputError/InputError';
import AuthSocialButtons from '@/Components/Auth/AuthSocialButtons/AuthSocialButtons';
import { clearStoredQuizResultCategory, getStoredQuizResultCategory } from '@/Utils/authQuizResultStorage';
import { Link, useForm } from '@inertiajs/react';
import styles from './RegisterForm.module.css';

export default function RegisterForm({ autoFocus = false }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        quiz_result_category: null,
    });

    useEffect(() => {
        const quizResultCategory = getStoredQuizResultCategory();

        if (quizResultCategory) {
            setData('quiz_result_category', quizResultCategory);
        }

        return () => {
            reset('password', 'password_confirmation');
        };
    }, [reset, setData]);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onSuccess: () => {
                clearStoredQuizResultCategory();
            },
        });
    };

    return (
        <form onSubmit={submit} className={styles.root}>
            <div className="mk-auth-field">
                <label htmlFor="name" className={`mk-auth-label ${styles.desktopAlign}`}>
                    Nombre completo
                </label>
                <input
                    id="name"
                    name="name"
                    value={data.name}
                    className={`mk-auth-input mk-auth-input-lime ${styles.input} ${styles.desktopAlign}`}
                    autoComplete="name"
                    autoFocus={autoFocus}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder=" "
                    required
                />
                <InputError message={errors.name} className={`${styles.error} ${styles.desktopAlign}`} />
            </div>

            <div className="mk-auth-field">
                <label htmlFor="email" className={`mk-auth-label ${styles.desktopAlign}`}>
                    Correo electrónico
                </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className={`mk-auth-input mk-auth-input-lime ${styles.input} ${styles.desktopAlign}`}
                    autoComplete="username"
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder=" "
                    required
                />
                <InputError message={errors.email} className={`${styles.error} ${styles.desktopAlign}`} />
            </div>

            <div className="mk-auth-field">
                <label htmlFor="password" className={`mk-auth-label ${styles.desktopAlign}`}>
                    Contraseña
                </label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    className={`mk-auth-input mk-auth-input-lime ${styles.input} ${styles.desktopAlign}`}
                    autoComplete="new-password"
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder=" "
                    required
                />
                <InputError message={errors.password} className={`${styles.error} ${styles.desktopAlign}`} />
            </div>

            <div className="mk-auth-field">
                <label htmlFor="password_confirmation" className={`mk-auth-label ${styles.desktopAlign}`}>
                    Confirmar contraseña
                </label>
                <input
                    id="password_confirmation"
                    type="password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    className={`mk-auth-input mk-auth-input-lime ${styles.input} ${styles.desktopAlign}`}
                    autoComplete="new-password"
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    placeholder=" "
                    required
                />

                <InputError
                    message={errors.password_confirmation}
                    className={`${styles.error} ${styles.desktopAlign}`}
                />
            </div>

            <button type="submit" className={`mk-auth-btn-lime ${styles.submitButton}`} disabled={processing}>
                <span>{processing ? 'Creando cuenta...' : 'Crear mi cuenta'}</span>
            </button>

            <AuthSocialButtons dividerText="o regístrate con" />


            <p className={`${styles.legalText} ${styles.desktopAlign}`}>
                Al registrarte, aceptas nuestros{' '}
                <Link href={route('terms.use')} className={`mk-auth-link ${styles.inlineLink}`}>
                    Términos de uso
                </Link>{' '}
                y{' '}
                <Link href={route('privacy.policy')} className={`mk-auth-link ${styles.inlineLink}`}>
                    Política de privacidad
                </Link>
                .
            </p>
        </form>
    );
}
