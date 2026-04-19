import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
    {
        ignores: ['public/**', 'vendor/**', 'node_modules/**'],
    },
    {
        files: ['resources/js/**/*.{js,jsx}'],
        ...js.configs.recommended,
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
        plugins: {
            'react-hooks': reactHooks,
        },
        rules: {
            'no-alert': 'error',
            'no-unused-vars': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
    },
    {
        files: [
            'resources/js/{Pages,Components,Layouts}/**/*.{js,jsx}',
            'resources/js/app.jsx',
            'resources/js/AppProviders.jsx',
        ],
        rules: {
            'no-restricted-imports': ['error', {
                paths: [
                    {
                        name: 'axios',
                        message: 'UI layers must not call HTTP clients directly. Use feature hooks.',
                    },
                ],
                patterns: [
                    {
                        group: ['@/Features/*/services/*'],
                        message: 'UI layers must consume feature hooks instead of feature services.',
                    },
                    {
                        group: [
                            '../Features/*/services/*',
                            '../../Features/*/services/*',
                            '../../../Features/*/services/*',
                            '../../../../Features/*/services/*',
                        ],
                        message: 'UI layers must consume feature hooks instead of feature services.',
                    },
                ],
            }],
        },
    },
    {
        files: ['resources/js/Features/**/*.{js,jsx}'],
        rules: {
            'no-restricted-imports': ['error', {
                patterns: [
                    {
                        group: ['@/Pages/**', '@/Components/**'],
                        message: 'Feature layer must stay UI-agnostic and cannot depend on Pages/Components.',
                    },
                ],
            }],
        },
    },
    {
        files: ['resources/js/Shared/**/*.{js,jsx}'],
        rules: {
            'no-restricted-imports': ['error', {
                patterns: [
                    {
                        group: ['@/Features/**', '@/Pages/**', '@/Components/**'],
                        message: 'Shared layer must stay dependency-light and cannot depend on app layers.',
                    },
                ],
            }],
        },
    },
];
