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
          message: 'Network access only inside src/lib/api/**.',
        },
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message: 'dangerouslySetInnerHTML is only allowed for the theme bootstrap and JSON-LD.',
        },
      ],
    },
  },
  // The lead form client is the only place that may call fetch
  {
    files: ['src/lib/api/**/*.ts'],
    rules: { 'no-restricted-syntax': 'off' },
  },
  // Token files and dev surfaces may hold raw literals / dev-only copy
  {
    files: ['src/styles/**/*.ts', 'eslint/**/*.mjs', 'scripts/**/*.mjs'],
    rules: { 'vm/no-raw-design-literals': 'off' },
  },
  {
    files: ['src/app/opengraph-image.tsx', 'tests/**/*.{ts,tsx}', '**/*.test.{ts,tsx}'],
    rules: { 'vm/no-jsx-literal-strings': 'off', 'vm/no-raw-design-literals': 'off' },
  },
  // Illustrative mock app screens: their text is sample UI content, not site copy
  {
    files: ['src/components/marketing/WebScreens.tsx', 'src/components/marketing/PhoneScreens.tsx'],
    rules: { 'vm/no-jsx-literal-strings': 'off' },
  },
  // Sanctioned innerHTML sites: the nonce'd theme bootstrap
  {
    files: ['src/app/layout.tsx', 'src/components/marketing/JsonLd.tsx'],
    rules: { 'no-restricted-syntax': 'off' },
  },
  {
    files: ['**/*.mjs', '*.config.ts', '*.config.mts', 'tests/**/*.ts'],
    ...tseslint.configs.disableTypeChecked,
  },
);
