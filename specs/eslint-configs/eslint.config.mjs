import { configs, utils } from '@rightcapital/eslint-config';

const { defineConfig } = utils;

export default defineConfig(
  {
    files: ['src/javascript.js'],
    extends: [...configs.js],
  },
  {
    files: ['src/typescript.ts'],
    extends: [...configs.ts],
  },
  {
    files: ['src/typescript-react.tsx'],
    extends: [...configs.ts, ...configs.react],
  },
);
