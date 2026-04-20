import InputError from '@/Components/InputError/InputError';
import InputLabel from '@/Components/InputLabel/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton/PrimaryButton';
import TextInput from '@/Components/TextInput/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import styles from './UpdatePasswordForm.module.css';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (event) => {
        event.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (formErrors) => {
                if (formErrors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (formErrors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={`${styles.root} ${styles.section} ${className}`}>
            <header className={styles.header}>
                <h2 className={styles.title}>Update Password</h2>

                <p className={styles.description}>
                    Ensure your account is using a long, random password to stay secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className={styles.form}>
                <div className={styles.field}>
                    <InputLabel htmlFor="current_password" value="Current Password" />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(event) => setData('current_password', event.target.value)}
                        type="password"
                        className={styles.input}
                        autoComplete="current-password"
                    />

                    <InputError message={errors.current_password} className={styles.error} />
                </div>

                <div className={styles.field}>
                    <InputLabel htmlFor="password" value="New Password" />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(event) => setData('password', event.target.value)}
                        type="password"
                        className={styles.input}
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password} className={styles.error} />
                </div>

                <div className={styles.field}>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(event) => setData('password_confirmation', event.target.value)}
                        type="password"
                        className={styles.input}
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password_confirmation} className={styles.error} />
                </div>

                <div className={styles.actions}>
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className={styles.savedMessage}>Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
