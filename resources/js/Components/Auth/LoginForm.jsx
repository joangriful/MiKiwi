import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import AuthSocialButtons from '@/Components/Auth/AuthSocialButtons';
import { Link, useForm } from '@inertiajs/react';

export default function LoginForm({ status, canResetPassword, autoFocus = false }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <form onSubmit={submit} className="space-y-5">
            {status && (
                <div className="mk-auth-status-success">
                    {status}
                </div>
            )}

            <div className="mk-auth-field">
                <label htmlFor="email" className="mk-auth-label">
                    Correo electrónico
                </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mk-auth-input mk-auth-input-access w-full px-4 py-3.5 text-sm"
                    autoComplete="username"
                    autoFocus={autoFocus}
                    required
                    placeholder=" "
                    onChange={(e) => setData('email', e.target.value)}
                />
                <InputError message={errors.email} className="mt-2 text-xs" />
            </div>

            <div className="mk-auth-field">
                <label htmlFor="password" className="mk-auth-label">
                    Contraseña
                </label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    className="mk-auth-input mk-auth-input-access w-full px-4 py-3.5 text-sm"
                    autoComplete="current-password"
                    required
                    placeholder=" "
                    onChange={(e) => setData('password', e.target.value)}
                />
                <InputError message={errors.password} className="mt-2 text-xs" />
            </div>

            <div className="flex items-center justify-between pt-1">
                <label className="group/check flex cursor-pointer items-center gap-2.5">
                    <input
                        type="checkbox"
                        name="remember"
                        checked={data.remember}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-500 transition-all focus:ring-indigo-500"
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    <span className="text-xs text-gray-500 transition-colors group-hover/check:text-gray-700">
                        Recordarme
                    </span>
                </label>
                {canResetPassword && (
                    <Link
                        href={route('password.request')}
                        className="mk-auth-link text-xs font-medium"
                    >
                        ¿Has olvidado tu contraseña?
                    </Link>
                )}
            </div>

            <button type="submit" className="mk-auth-btn-primary mk-auth-btn-access mt-2 w-full py-4 text-xs font-semibold uppercase" disabled={processing}>
                <span>
                    {processing ? 'Accediendo...' : 'Acceso'}
                </span>
            </button>

            <AuthSocialButtons dividerText="o continúa con" />

            <p className="pt-2 text-center text-xs text-gray-500">
                ¿No tienes cuenta?{' '}
                <Link href={route('register')} className="mk-auth-link font-medium">
                    Crear cuenta
                </Link>
            </p>
        </form>
    );
}
