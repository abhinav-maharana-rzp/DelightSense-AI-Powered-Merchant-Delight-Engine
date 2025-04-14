<<<<<<< HEAD
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
=======
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
>>>>>>> parent of 65b82f2 (frontend removal)
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
<<<<<<< HEAD
      ...reactHooks.configs.recommended.rules,
=======
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
>>>>>>> parent of 65b82f2 (frontend removal)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
<<<<<<< HEAD
  },
)
=======
    overrideConfig: {
      linterOptions: {
        reportUnusedDisableDirectives: true,
      },
    }
  },
];
>>>>>>> parent of 65b82f2 (frontend removal)
