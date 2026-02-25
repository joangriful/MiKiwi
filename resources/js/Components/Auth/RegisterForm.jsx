import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import AuthSocialButtons from '@/Components/Auth/AuthSocialButtons';
import { Link, useForm } from '@inertiajs/react';

export default function RegisterForm({ autoFocus = false }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        quiz_result_category: null,
    });

    useEffect(() => {
        // Load quiz result category from localStorage if available
        const quizData = localStorage.getItem('quizData');
        if (quizData) {
            try {
                const { resultCategory } = JSON.parse(quizData);
                if (resultCategory) {
                    setData('quiz_result_category', resultCategory);
                }
            } catch (e) {
                console.error('Error loading quiz data from localStorage', e);
            }
        }

        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onSuccess: () => {
                // Clear localStorage quiz data after successful registration
                localStorage.removeItem('quizData');
            }
        });
    };

    return (
        <form onSubmit={submit} className="space-y-5">
            <div className="mk-auth-field">
                <label htmlFor="name" className="mk-auth-label md:text-right">
                    Nombre completo
                </label>
                <input
                    id="name"
                    name="name"
                    value={data.name}
                    className="mk-auth-input mk-auth-input-lime w-full px-4 py-3.5 text-sm md:text-right"
                    autoComplete="name"
                    autoFocus={autoFocus}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder=" "
                    required
                />
                <InputError message={errors.name} className="mt-2 text-xs md:text-right" />
            </div>

            <div className="mk-auth-field">
                <label htmlFor="email" className="mk-auth-label md:text-right">
                    Correo electrónico
                </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mk-auth-input mk-auth-input-lime w-full px-4 py-3.5 text-sm md:text-right"
                    autoComplete="username"
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder=" "
                    required
                />
                <InputError message={errors.email} className="mt-2 text-xs md:text-right" />
            </div>

            <div className="mk-auth-field">
                <label htmlFor="password" className="mk-auth-label md:text-right">
                    Contraseña
                </label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    className="mk-auth-input mk-auth-input-lime w-full px-4 py-3.5 text-sm md:text-right"
                    autoComplete="new-password"
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder=" "
                    required
                />
                <InputError message={errors.password} className="mt-2 text-xs md:text-right" />
            </div>

            <div className="mk-auth-field">
                <label htmlFor="password_confirmation" className="mk-auth-label md:text-right">
                    Confirmar contraseña
                </label>
                <input
                    id="password_confirmation"
                    type="password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    className="mk-auth-input mk-auth-input-lime w-full px-4 py-3.5 text-sm md:text-right"
                    autoComplete="new-password"
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    placeholder=" "
                    required
                />

                <InputError
                    message={errors.password_confirmation}
                    className="mt-2 text-xs md:text-right"
                />
            </div>

            <button type="submit" className="mk-auth-btn-lime mt-2 w-full py-4 text-xs font-semibold uppercase" disabled={processing}>
                <span>{processing ? 'Creando cuenta...' : 'Crear mi cuenta'}</span>
            </button>

            <AuthSocialButtons dividerText="o regístrate con" />


            <p className="text-[10px] leading-relaxed text-gray-400 md:text-right">
                Al registrarte, aceptas nuestros{' '}
                <Link href={route('terms.use')} className="mk-auth-link font-medium">
                    Términos de uso
                </Link>{' '}
                y{' '}
                <Link href={route('privacy.policy')} className="mk-auth-link font-medium">
                    Política de privacidad
                </Link>
                .
            </p>
        </form>
    );
}
