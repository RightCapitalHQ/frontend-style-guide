import { configs, utils } from '@rightcapital/eslint-config';

const { defineConfig } = utils;

export default defineConfig(...configs.recommended, {
  rules: {
    // deprecated rules
    'indent-legacy': 'off',
    'no-new-object': 'error',

    // unknown rules
    'unknown-rule-off': 'off',
    '@prefixed/unknown-rule-off': 'off',
  },
});
