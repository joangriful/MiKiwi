import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import styles from './TextInput.module.css';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={[styles.root, className].filter(Boolean).join(' ')}
            ref={localRef}
        />
    );
});
