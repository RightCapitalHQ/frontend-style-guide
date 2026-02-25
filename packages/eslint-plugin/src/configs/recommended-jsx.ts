import type { ConfigObject } from '@eslint/core';

export const recommendedJsxConfig: ConfigObject = {
  files: ['**/*.{jsx,tsx}'],
  rules: {
    '@rightcapital/jsx-no-unused-expressions': 'error',
  },
};
