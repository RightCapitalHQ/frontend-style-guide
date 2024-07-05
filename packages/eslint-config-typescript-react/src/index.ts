import type { Linter } from 'eslint';

require('@rushstack/eslint-patch/modern-module-resolution');

const config: Linter.Config = {
  extends: [
    require.resolve('@rightcapital/eslint-config-typescript'),
    require.resolve('./rules/hooks'),
    require.resolve('./rules/react-a11y'),
    'plugin:@rightcapital/recommended-react',
    'plugin:@eslint-react/recommended-legacy',
  ],
  plugins: ['@rightcapital'],
  reportUnusedDisableDirectives: true,
  rules: {
    '@eslint-react/no-useless-fragment': 'error',
    '@rightcapital/no-explicit-type-on-function-component-identifier': 'error',
  },
};

export = config;
