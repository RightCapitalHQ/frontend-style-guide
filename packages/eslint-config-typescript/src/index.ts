import type { Linter } from 'eslint';

require('@rushstack/eslint-patch/modern-module-resolution');

const config: Linter.Config = {
  extends: [
    require.resolve('@rightcapital/eslint-config-base'),
    'plugin:@typescript-eslint/recommended-type-checked',
  ],
  parser: require.resolve('@typescript-eslint/parser'),
  plugins: ['@rightcapital'],
  // https://typescript-eslint.io/packages/parser/#configuration
  parserOptions: {
    EXPERIMENTAL_useProjectService: true,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.cts', '.mts', '.tsx'],
    },
    'import/resolver': {
      typescript: { alwaysTryTypes: true },
    },
  },
  reportUnusedDisableDirectives: true,
  /**
   * Be careful when adding extension rules from `@typescript-eslint`,
   * make sure the ESLint core rules are disabled first.
   *
   * @see https://typescript-eslint.io/rules/#extension-rules
   */
  rules: {
    // https://typescript-eslint.io/rules/restrict-template-expressions/
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      {
        // default options
        allowAny: true,
        allowBoolean: true,
        allowNullish: true,
        allowNumber: true,
        allowRegExp: true,

        // extra options for flexibility
        allowNever: true,
      },
    ],

    // https://typescript-eslint.io/rules/no-non-null-assertion
    '@typescript-eslint/no-non-null-assertion': 'error',

    // https://typescript-eslint.io/rules/no-empty-interface
    '@typescript-eslint/no-empty-interface': 'error',

    '@typescript-eslint/naming-convention': [
      'error',
      {
        // interface starts with `I`
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: true,
        },
      },
    ],

    // https://typescript-eslint.io/rules/no-shadow/
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',

    // https://typescript-eslint.io/rules/no-empty-function/
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'error',

    // https://typescript-eslint.io/rules/no-unused-vars/
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    // https://typescript-eslint.io/rules/no-useless-constructor/
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': ['error'],

    // https://typescript-eslint.io/rules/no-use-before-define/
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false,
        classes: false,
        /**
         * set `variables:false` allows such code, which is safe:
         *   const a = () => b()
         *   const b = () => 2
         *
         * but not this
         * (always an ESLint error, unless with `no-use-before-define: "off"`),
         * which is actually dangerous code:
         *   const c = d()
         *   const d = () => 2
         */
        variables: false,
        typedefs: false,
      },
    ],

    // https://github.com/RightCapitalHQ/frontend-style-guide/issues/55
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    '@typescript-eslint/consistent-type-exports': [
      'error',
      { fixMixedExportsWithInlineTypeSpecifier: true },
    ],
    '@typescript-eslint/no-import-type-side-effects': 'error',
    'import/no-duplicates': ['error', { 'prefer-inline': true }],
    '@rightcapital/no-explicit-type-on-function-component-identifier': 'error',
  },
};

export = config;
