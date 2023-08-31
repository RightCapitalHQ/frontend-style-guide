require('@rushstack/eslint-patch/modern-module-resolution');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    require.resolve('eslint-config-airbnb/rules/react'),
    require.resolve('eslint-config-airbnb/rules/react-a11y'),
    require.resolve('eslint-config-airbnb/hooks'),
    require.resolve('@rightcapital/eslint-config-typescript'),
    require.resolve('eslint-config-prettier'),
  ],
  reportUnusedDisableDirectives: true,
  rules: {
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.tsx'] }],
    'react/jsx-key': ['error'],
    'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    // We are using TypeScript, so it's not necessary to use React's defaultProps
    'react/require-default-props': 'off',
  },
};
