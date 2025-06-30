import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import astro from 'eslint-plugin-astro';
import astroParser from 'astro-eslint-parser';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
        console: 'readonly',
        URL: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      // TypeScript rules (완화)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-var-requires': 'error',

      // General JavaScript rules (완화)
      'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
      'no-debugger': 'warn', // 개발 중이므로 warning으로
      'no-duplicate-imports': 'warn',
      'no-unused-vars': 'off', // handled by @typescript-eslint/no-unused-vars
      'prefer-const': 'warn',
      'no-var': 'error',
      'no-undef': 'warn', // 개발 중이므로 warning으로

      // Performance rules
      'no-await-in-loop': 'warn',
      'require-atomic-updates': 'warn',

      // 접근성 규칙 (중요한 것만 error, 나머지는 warn)
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-has-content': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/heading-has-content': 'warn',
      'jsx-a11y/html-has-lang': 'error',
      'jsx-a11y/img-redundant-alt': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/no-redundant-roles': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',

      // Code style (완화)
      'object-shorthand': 'warn',
      'prefer-template': 'warn',
      quotes: ['warn', 'single', { avoidEscape: true }],
      semi: ['warn', 'always'],
    },
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsparser,
        extraFileExtensions: ['.astro'],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        console: 'readonly',
        URL: 'readonly',
      },
    },
    plugins: {
      astro,
      '@typescript-eslint': tseslint,
    },
    rules: {
      // Astro 기본 규칙들 (완화)
      'astro/no-conflict-set-directives': 'error',
      'astro/no-unused-define-vars-in-style': 'warn',
      'astro/valid-compile': 'error',
      'astro/no-deprecated-astro-canonicalurl': 'warn',
      'astro/no-deprecated-astro-resolve': 'warn',
      'astro/no-unused-css-selector': 'off', // 개발 중이므로 비활성화

      // 일반 규칙들도 완화
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    files: ['*.ts', '*.tsx'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off', // 개발 중이므로 비활성화
    },
  },
  {
    files: ['src/pages/api/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    rules: {
      semi: ['warn', 'always'],
      'no-unused-vars': 'warn',
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '.astro/', 'public/', '*.config.js', '*.config.mjs'],
  },
];
