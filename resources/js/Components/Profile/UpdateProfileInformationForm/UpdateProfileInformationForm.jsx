import InputError from '@/Components/InputError/InputError';
import InputLabel from '@/Components/InputLabel/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton/PrimaryButton';
import TextInput from '@/Components/TextInput/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import styles from './UpdateProfileInformationForm.module.css';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (event) => {
        event.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={`${styles.root} ${styles.section} ${className}`}>
            <header className={styles.header}>
                <h2 className={styles.title}>Profile Information</h2>

                <p className={styles.description}>
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className={styles.form}>
                <div className={styles.field}>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className={styles.input}
                        value={data.name}
                        onChange={(event) => setData('name', event.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className={styles.error} message={errors.name} />
                </div>

                <div className={styles.field}>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className={styles.input}
                        value={data.email}
                        onChange={(event) => setData('email', event.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className={styles.error} message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className={styles.verificationBlock}>
                        <p className={styles.verificationText}>
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className={styles.verificationLink}
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className={styles.verificationSuccess}>
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

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
