import type { Linter } from 'eslint';

// Fix eslint shareable config (https://github.com/eslint/eslint/issues/3458)
require('@rushstack/eslint-patch/modern-module-resolution');

const config: Linter.Config = {
  extends: [
    require.resolve('eslint-config-airbnb-base'),
    require.resolve('eslint-config-prettier'),
  ],
  plugins: ['simple-import-sort', 'unicorn'],
  parserOptions: {
    ecmaVersion: 'latest',
    ecmaFeatures: { jsx: true },
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  reportUnusedDisableDirectives: true,
  rules: {
    curly: ['error', 'all'],

    // not necessary or too opinionated
    'default-param-last': 'off',
    'class-methods-use-this': 'off',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',

    /**
     * We want to allow for...of statement, but airbnb config disables it.
     * We override this rule from airbnb-base.
     *
     * airbnb config: https://github.com/airbnb/javascript/blob/5c01a1094986c4dd50a6ee4d9f7617abdfabb58a/packages/eslint-config-airbnb-base/rules/style.js#L338-L358
     */
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
      {
        /** https://stackoverflow.com/a/72903871/2488867 */
        selector:
          "MemberExpression[object.property.name='constructor'][property.name='name']",
        message: 'constructor name is not reliable, do not use it.',
      },
    ],

    // MEMO: simple-import-sort/imports should not be used with import/order
    'import/order': 'off',
    'simple-import-sort/imports': 'error',

    'simple-import-sort/exports': 'error',
    'import/extensions': [
      'warn',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
        js: 'never',
        jsx: 'never',
      },
    ],
    'import/prefer-default-export': 'off',

    'unicorn/prefer-node-protocol': 'error',
    'unicorn/text-encoding-identifier-case': 'error',
  },
};

export = config;
