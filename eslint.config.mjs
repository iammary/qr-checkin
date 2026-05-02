import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import unicorn from 'eslint-plugin-unicorn';
import sonarjs from 'eslint-plugin-sonarjs';
import prettier from 'eslint-config-prettier';

const nextJsSpecialFiles = [
  'src/app/**/page.tsx',
  'src/app/**/layout.tsx',
  'src/app/**/loading.tsx',
  'src/app/**/error.tsx',
  'src/app/**/not-found.tsx',
  'src/app/**/robots.ts',
  'src/app/**/template.tsx',
  'src/app/**/default.tsx',
  'next.config.ts',
  'vitest.config.ts',
  'eslint.config.mjs',
  '.storybook/main.ts',
  '.storybook/preview.tsx',
  '.storybook/vitest.setup.ts',
];

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: ['coverage/**', '.next/**', 'out/**', 'dist/**', 'storybook-static/**', 'next-env.d.ts'],
  },
  ...nextVitals,
  ...nextTs,
  unicorn.configs['flat/recommended'],
  sonarjs.configs.recommended,
  { rules: { ...prettier.rules } },
  {
    rules: {
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'arrow-body-style': ['error', 'as-needed'],
      'no-restricted-imports': [
        'error',
        {
          name: 'react',
          importNames: ['default'],
          message: 'Do not import React explicitly. The JSX runtime handles it automatically.',
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'FunctionDeclaration',
          message: 'Use arrow function syntax instead of function declarations.',
        },
        {
          selector:
            'TSTypeReference[typeName.name="FC"], TSTypeReference[typeName.name="FunctionComponent"], TSTypeReference[typeName.object.name="React"][typeName.property.name="FC"], TSTypeReference[typeName.object.name="React"][typeName.property.name="FunctionComponent"]',
          message: 'Do not use React.FC or React.FunctionComponent. Type props directly.',
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['src/app/**/not-found.tsx', '**/*.type.ts'],
    rules: {
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            camelCase: true,
            pascalCase: true,
          },
        },
      ],
    },
  },
  {
    files: ['**/use*.ts', '**/use*.tsx'],
    rules: {
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            camelCase: true,
          },
        },
      ],
    },
  },
  {
    files: ['**/*.type.ts'],
    rules: {
      'unicorn/filename-case': 'off',
    },
  },
  {
    ignores: [...nextJsSpecialFiles, '**/*.stories.ts', '**/*.stories.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportDefaultDeclaration',
          message: 'Use named exports. Default exports are only allowed in Next.js special files.',
        },
        {
          selector: 'FunctionDeclaration',
          message: 'Use arrow function syntax instead of function declarations.',
        },
        {
          selector:
            'TSTypeReference[typeName.name="FC"], TSTypeReference[typeName.name="FunctionComponent"], TSTypeReference[typeName.object.name="React"][typeName.property.name="FC"], TSTypeReference[typeName.object.name="React"][typeName.property.name="FunctionComponent"]',
          message: 'Do not use React.FC or React.FunctionComponent. Type props directly.',
        },
      ],
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'unicorn/no-useless-undefined': 'off',
      'no-restricted-imports': [
        'error',
        {
          name: 'react',
          importNames: ['default'],
          message: 'Do not import React explicitly. The JSX runtime handles it automatically.',
        },
        {
          name: 'vitest',
          importNames: ['describe', 'it', 'expect', 'vi'],
          message: 'Vitest globals are auto-imported. Do not import them explicitly.',
        },
      ],
    },
  },
  {
    files: ['scripts/**/*.ts'],
    rules: {
      'sonarjs/no-os-command-from-path': 'off',
      'unicorn/no-process-exit': 'off',
    },
  },
];

export default config;
