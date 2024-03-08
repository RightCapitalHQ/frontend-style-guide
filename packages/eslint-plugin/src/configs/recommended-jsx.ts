import type { ESLint } from 'eslint';

export const recommendedJsxConfig: ESLint.ConfigData = {
  overrides: [
    {
      files: '**/*.{jsx,tsx}',
      rules: {
        '@rightcapital/jsx-no-unused-expressions': 'error',
      },
    },
  ],
};
