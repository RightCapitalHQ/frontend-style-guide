import type { OxlintConfig, OxlintOverride } from 'oxlint';

type Rules = NonNullable<OxlintConfig['rules']>;
type Plugins = NonNullable<OxlintConfig['plugins']>;

export const basePlugins: Plugins = ['typescript', 'unicorn', 'oxc', 'import'];

/**
 * Only used when `recommended` is set.
 * Oxlint's `correctness` category is the starting point.
 * Rules below only add behavior carried over from `@rightcapital/eslint-config`.
 */
export const baseRules: Rules = {
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
};

/**
 * Rules for the files of a profile, where the runtime globals are known.
 * `no-undef` can only be trusted where a profile declares the globals.
 */
export const profileRules: Rules = {
  'eslint/no-undef': 'error',
};

export const nodePlugins: Plugins = ['node'];

export const nodeRules: Rules = {
  'node/no-new-require': 'error',
  'node/no-path-concat': 'error',
  'unicorn/no-process-exit': 'error',
  'unicorn/prefer-import-meta-properties': 'error',
};

export const reactPlugins: Plugins = ['react'];

/**
 * Only loaded with `recommended`, where its `correctness` rules are enabled.
 */
export const a11yPlugins: Plugins = ['jsx-a11y'];

export const reactRules: Rules = {
  'react/rules-of-hooks': 'error',
  'react/exhaustive-deps': 'warn',
};

export const scriptingRules: Rules = {
  'eslint/no-console': 'off',
  'unicorn/no-process-exit': 'off',
  // execa, zx, bun use tagged templates like `$`sleep 5`` to run commands
  'eslint/no-unused-expressions': ['error', { allowTaggedTemplates: true }],
};

export type RuntimeEnv = NonNullable<OxlintOverride['env']>;
