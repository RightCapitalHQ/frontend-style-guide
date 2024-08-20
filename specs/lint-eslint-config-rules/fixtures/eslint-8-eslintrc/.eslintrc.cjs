/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@rightcapital/javascript'],
  rules: {
    // deprecated rules
    'indent-legacy': 'off',
    'no-new-object': 'error',

    // unknown rules
    'unknown-rule-off': 'off',
    'unknown-rule-error': 'error',
    '@prefixed/unknown-rule-off': 'off',
    '@prefixed/unknown-rule-error': 'error',
  },
};
