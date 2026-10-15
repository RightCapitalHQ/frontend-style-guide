import type { Mixin, Rules } from '../types.js';

/**
 * Only used when `recommended` is set.
 * Oxlint's `correctness` category is the starting point.
 * Rules below only add behavior carried over from `@rightcapital/eslint-config`.
 */
const config: Mixin = {
  plugins: ['typescript', 'unicorn', 'oxc', 'import'],
  rules: {
    'eslint/no-var': 'error',
    'eslint/prefer-const': 'error',
    'eslint/no-console': 'warn',
    'typescript/consistent-type-definitions': ['error', 'interface'],
    'typescript/consistent-type-imports': 'error',
    'typescript/no-non-null-assertion': 'error',
    'unicorn/prefer-node-protocol': 'error',
    'unicorn/text-encoding-identifier-case': 'error',
    'unicorn/prefer-array-some': 'error',
    'unicorn/prefer-includes': 'error',

    // type-aware rules
    'typescript/no-floating-promises': 'error',
    'typescript/no-misused-promises': 'error',
    'typescript/await-thenable': 'error',
    'typescript/no-unnecessary-type-assertion': 'error',
  },
};

/**
 * Rules for files where the runtime globals are known,
 * i.e. where `runtime` is set.
 */
export const runtimeRules: Rules = {
  'eslint/no-undef': 'error',
};

/**
 * TypeScript already reports undefined names, and typescript-eslint
 * recommends disabling `no-undef` for these files.
 * https://typescript-eslint.io/troubleshooting/typed-linting/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
 */
export const typescriptFiles = ['**/*.{ts,cts,mts,tsx}'];

export default config;
