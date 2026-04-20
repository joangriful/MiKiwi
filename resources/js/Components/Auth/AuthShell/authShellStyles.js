import authShellStyles from './AuthShell.module.css';

export function authClass(...names) {
    return names.flat().filter(Boolean).map((name) => authShellStyles[name]).join(' ');
}

export { authShellStyles };
