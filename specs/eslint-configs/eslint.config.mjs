import eslintConfigRightcapital from '@rightcapital/eslint-config';

const { defineConfig } = eslintConfigRightcapital.utils;

export default defineConfig(
  {
    files: ['src/javascript.js'],
    extends: [...eslintConfigRightcapital.configs.js],
  },
  {
    files: ['src/typescript.ts'],
    extends: [...eslintConfigRightcapital.configs.ts],
  },
  {
    files: ['src/typescript-react.tsx'],
    extends: [
      ...eslintConfigRightcapital.configs.ts,
      ...eslintConfigRightcapital.configs.react,
    ],
  },
);
