import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierRecommended from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';

export default [
  {
    ignores: ['wailsjs/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        jsx: true,
        project: new URL('tsconfig.eslint.json', import.meta.url).pathname, // explicitly changed here
      },
    },
    plugins: {
      react: reactRecommended.plugins.react,
      'react-hooks': reactHooks,
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      ...reactRecommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...typescriptEslint.configs.recommended.rules,
      ...prettierRecommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
