import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import { Link, useForm } from '@inertiajs/react';

export default function ResetPasswordForm({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'));
    };

    return (
        <form onSubmit={submit} className="space-y-5">
            <div className="mk-auth-field">
                <label htmlFor="email" className="mk-auth-label">
                    Correo electrónico
                </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mk-auth-input w-full px-4 py-3.5 text-sm"
                    autoComplete="username"
                    required
                    placeholder=" "
                    onChange={(e) => setData('email', e.target.value)}
                />
                <InputError message={errors.email} className="mt-2 text-xs" />
            </div>

            <div className="mk-auth-field">
                <label htmlFor="password" className="mk-auth-label">
                    Nueva contraseña
                </label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    className="mk-auth-input w-full px-4 py-3.5 text-sm"
                    autoComplete="new-password"
                    autoFocus
                    required
                    placeholder=" "
                    onChange={(e) => setData('password', e.target.value)}
                />
                <InputError message={errors.password} className="mt-2 text-xs" />
            </div>

            <div className="mk-auth-field">
                <label htmlFor="password_confirmation" className="mk-auth-label">
                    Confirmar contraseña
                </label>
                <input
                    type="password"
                    id="password_confirmation"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    className="mk-auth-input w-full px-4 py-3.5 text-sm"
                    autoComplete="new-password"
                    required
                    placeholder=" "
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                />

                <InputError
                    message={errors.password_confirmation}
                    className="mt-2 text-xs"
                />
            </div>

            <button type="submit" className="mk-auth-btn-primary w-full py-4 text-xs font-semibold uppercase" disabled={processing}>
                <span>{processing ? 'Actualizando...' : 'Actualizar contraseña'}</span>
            </button>

            <div className="text-center text-xs text-gray-500">
                <Link href={route('login')} className="mk-auth-link font-medium">
                    Volver a iniciar sesión
                </Link>
            </div>
        </form>
    );
}
