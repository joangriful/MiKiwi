import { Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { createContext, useContext, useState } from 'react';
import styles from './Dropdown.module.css';

const DropDownContext = createContext();

const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        setOpen((previousState) => !previousState);
    };

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className={styles.root}>{children}</div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { open, setOpen, toggleOpen } = useContext(DropDownContext);

    return (
        <>
            <div onClick={toggleOpen}>{children}</div>

            {open && (
                <div
                    className={styles.backdrop}
                    onClick={() => setOpen(false)}
                />
            )}
        </>
    );
};

const Content = ({
    align = 'right',
    width = '48',
    contentClasses = '',
    children,
}) => {
    const { open, setOpen } = useContext(DropDownContext);

    const alignmentClassName =
        align === 'left' ? styles.alignLeft : styles.alignRight;
    const widthClassName = width === '48' ? styles.width48 : '';
    const panelClassName = [styles.panel, contentClasses]
        .filter(Boolean)
        .join(' ');

    return (
        <Transition
            show={open}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
        >
            <div
                className={[
                    styles.content,
                    alignmentClassName,
                    widthClassName,
                ]
                    .filter(Boolean)
                    .join(' ')}
                onClick={() => setOpen(false)}
            >
                <div className={panelClassName}>{children}</div>
            </div>
        </Transition>
    );
};

const DropdownLink = ({ className = '', children, ...props }) => {
    const linkClassName = [styles.link, className].filter(Boolean).join(' ');

    return (
        <Link {...props} className={linkClassName}>
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
