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
  plugins: ['@rightcapital', '@stylistic/jsx'],
  reportUnusedDisableDirectives: true,
  rules: {
    '@eslint-react/naming-convention/component-name': ['error', 'PascalCase'],
    '@eslint-react/naming-convention/filename': [
      'error',
      { rule: 'kebab-case' },
    ],
    '@eslint-react/naming-convention/use-state': 'error',
    '@eslint-react/no-useless-fragment': 'error',
    '@rightcapital/no-explicit-type-on-function-component-identifier': 'error',
    '@stylistic/jsx/jsx-self-closing-comp': 'error',
  },
};

export = config;
