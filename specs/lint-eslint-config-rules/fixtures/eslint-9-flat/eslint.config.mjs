import eslintConfigRightcapital from '@rightcapital/eslint-config';

const { defineConfig } = eslintConfigRightcapital.utils;

export default defineConfig(...eslintConfigRightcapital.configs.recommended, {
  rules: {
    // deprecated rules
    'indent-legacy': 'off',
    'no-new-object': 'error',

    // unknown rules
    'unknown-rule-off': 'off',
    '@prefixed/unknown-rule-off': 'off',
  },
});
