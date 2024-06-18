import type { ClassicConfig } from '@typescript-eslint/utils/ts-eslint';

export const recommendedJsxConfig: ClassicConfig.Config = {
  overrides: [
    {
      files: '**/*.{jsx,tsx}',
      rules: {
        '@rightcapital/jsx-no-unused-expressions': 'error',
      },
    },
  ],
};
