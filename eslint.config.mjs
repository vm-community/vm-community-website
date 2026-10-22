import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';
import vm from './eslint/vm-plugin.mjs';

const ignores = [
  'node_modules/**',
  '.next/**',
  'out/**',
  'coverage/**',
  'test-results/**',
  'playwright-report/**',
  'screenshots/**',
  'next-env.d.ts',
  'public/**',
];

export default tseslint.config(
  { ignores },
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  {
    files: ['**/*.{ts,tsx,mjs}'],
    plugins: { 'react-hooks': reactHooks, '@next/next': nextPlugin, vm },
    rules: {
      ...reactHooks.configs['recommended-latest'].rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off',
      'vm/no-raw-design-literals': 'error',
      'vm/no-jsx-literal-strings': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.name='fetch']",
          message: 'Network access only inside src/lib/api/** (clients) and src/app/api/** (BFF).',
        },
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message: 'dangerouslySetInnerHTML is only allowed in the sanitised certificate frame.',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/mocks/*', '**/mocks/**'],
              message:
                'The mock backend may only be imported by the mock ApiClient, the dev toolbar and tests.',
            },
          ],
        },
      ],
    },
  },
  // Files that are allowed to use fetch
  {
    files: ['src/lib/api/**/*.ts', 'src/app/api/**/*.ts'],
    rules: { 'no-restricted-syntax': 'off' },
  },
  // Files that may import the mock backend
  {
    files: [
      'src/lib/api/mock/**/*.{ts,tsx}',
      'src/devtools/**/*.{ts,tsx}',
      'src/mocks/**/*.{ts,tsx}',
      '**/*.test.{ts,tsx}',
      'tests/**/*.{ts,tsx}',
    ],
    rules: { 'no-restricted-imports': 'off' },
  },
  // Token files and dev surfaces may hold raw literals / dev-only copy
  {
    files: ['src/styles/**/*.ts', 'eslint/**/*.mjs', 'scripts/**/*.mjs'],
    rules: { 'vm/no-raw-design-literals': 'off' },
  },
  {
    files: [
      'src/app/design-system/**/*.tsx',
      'src/mocks/**/*.ts',
      'tests/**/*.{ts,tsx}',
      '**/*.test.{ts,tsx}',
    ],
    rules: { 'vm/no-jsx-literal-strings': 'off', 'vm/no-raw-design-literals': 'off' },
  },
  // Sanctioned innerHTML sites: the nonce'd theme bootstrap and the sanitised certificate frame
  {
    files: ['src/app/layout.tsx', 'src/features/certificates/CertificateFrame.tsx'],
    rules: { 'no-restricted-syntax': 'off' },
  },
  {
    files: ['**/*.mjs', '*.config.ts', '*.config.mts', 'tests/**/*.ts'],
    ...tseslint.configs.disableTypeChecked,
  },
);
