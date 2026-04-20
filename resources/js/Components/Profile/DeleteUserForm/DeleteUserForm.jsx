import DangerButton from '@/Components/DangerButton/DangerButton';
import InputError from '@/Components/InputError/InputError';
import InputLabel from '@/Components/InputLabel/InputLabel';
import Modal from '@/Components/Modal/Modal';
import SecondaryButton from '@/Components/SecondaryButton/SecondaryButton';
import TextInput from '@/Components/TextInput/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import styles from './DeleteUserForm.module.css';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (event) => {
        event.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`${styles.root} ${styles.section} ${className}`}>
            <header className={styles.header}>
                <h2 className={styles.title}>Delete Account</h2>

                <p className={styles.description}>
                    Once your account is deleted, all of its resources and data will be permanently deleted.
                    Before deleting your account, please download any data or information that you wish to retain.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>Delete Account</DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className={styles.modalForm}>
                    <h2 className={styles.modalTitle}>Are you sure you want to delete your account?</h2>

                    <p className={styles.modalDescription}>
                        Once your account is deleted, all of its resources and data will be permanently deleted.
                        Please enter your password to confirm you would like to permanently delete your account.
                    </p>

                    <div className={styles.field}>
                        <InputLabel htmlFor="password" value="Password" className={styles.screenReaderOnly} />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(event) => setData('password', event.target.value)}
                            className={styles.passwordInput}
                            isFocused
                            placeholder="Password"
                        />

                        <InputError message={errors.password} className={styles.fieldError} />
                    </div>

                    <div className={styles.actions}>
                        <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>

                        <DangerButton className={styles.deleteAction} disabled={processing}>
                            Delete Account
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
