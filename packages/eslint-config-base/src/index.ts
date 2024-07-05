import type { Linter } from 'eslint';

// Fix eslint shareable config (https://github.com/eslint/eslint/issues/3458)
require('@rushstack/eslint-patch/modern-module-resolution');

const config: Linter.Config = {
  extends: [
    require.resolve('./rules/best-practices'),
    require.resolve('./rules/errors'),
    require.resolve('./rules/node'),
    require.resolve('./rules/style'),
    require.resolve('./rules/variables'),
    require.resolve('./rules/es6'),
    require.resolve('./rules/imports'),
  ],
  env: { es2024: true },
  parserOptions: {
    ecmaVersion: 'latest',
    ecmaFeatures: { jsx: true },
    sourceType: 'module',
  },
  reportUnusedDisableDirectives: true,
};

export = config;
