import type { ESLint } from 'eslint';

export const recommendedReactConfig: ESLint.ConfigData = {
  extends: ['plugin:@rightcapital/recommended-jsx'],
  rules: {
    '@rightcapital/no-ignore-return-value-of-react-hooks': 'error',
  },
};
