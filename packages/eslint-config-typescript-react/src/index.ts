import type { Linter } from 'eslint';

require('@rushstack/eslint-patch/modern-module-resolution');

const config: Linter.Config = {
  extends: [
    require.resolve('@rightcapital/eslint-config-typescript'),
    require.resolve('eslint-config-airbnb/hooks'),
    require.resolve('eslint-config-airbnb/rules/react-a11y'),
    'plugin:@rightcapital/recommended-react',
    'plugin:@eslint-react/recommended-legacy',
  ],
  plugins: ['@rightcapital'],
  reportUnusedDisableDirectives: true,
  rules: {
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    '@eslint-react/no-useless-fragment': ['error'],
    '@rightcapital/no-explicit-type-on-function-component-identifier': 'error',
  },
};

export = config;
