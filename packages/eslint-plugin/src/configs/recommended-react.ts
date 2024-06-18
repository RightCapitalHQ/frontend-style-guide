import type { ClassicConfig } from '@typescript-eslint/utils/ts-eslint';

export const recommendedReactConfig: ClassicConfig.Config = {
  extends: ['plugin:@rightcapital/recommended-jsx'],
  rules: {
    '@rightcapital/no-ignore-return-value-of-react-hooks': 'error',
  },
};
