import { defineConfig } from 'eslint/config';

import { recommendedJsxConfig } from './recommended-jsx.ts';

export const recommendedReactConfig = defineConfig({
  extends: [recommendedJsxConfig],
  rules: {
    '@rightcapital/no-ignore-return-value-of-react-hooks': 'error',
  },
});
