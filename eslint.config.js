import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';

export default [
    {
        ignores: ['public/**', 'vendor/**', 'node_modules/**', 'storage/**'],
    },
    js.configs.recommended,
    {
        files: ['resources/js/**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                route: 'readonly',
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            'jsx-a11y': jsxA11yPlugin,
        },
        rules: {
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'react/jsx-uses-vars': 'error',
            'react/jsx-no-useless-fragment': 'error',
            'react/self-closing-comp': 'error',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'error',
            'jsx-a11y/alt-text': 'error',
            'jsx-a11y/anchor-has-content': 'error',
            'jsx-a11y/aria-props': 'error',
            'jsx-a11y/aria-role': 'error',
            'jsx-a11y/click-events-have-key-events': 'error',
            'jsx-a11y/control-has-associated-label': 'error',
            'jsx-a11y/heading-has-content': 'error',
            'jsx-a11y/interactive-supports-focus': 'error',
            'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
            'jsx-a11y/no-aria-hidden-on-focusable': 'error',
            'jsx-a11y/no-static-element-interactions': 'error',
        },
    },
];
