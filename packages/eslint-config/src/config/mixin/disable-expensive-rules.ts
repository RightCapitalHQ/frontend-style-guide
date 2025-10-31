import type { ConfigObject } from '@eslint/core';
import * as typescriptEslint from 'typescript-eslint';

const config: readonly ConfigObject[] = [
  typescriptEslint.configs.disableTypeChecked,
  {
    rules: {
      'import-x/no-cycle': 'off',
    },
  },
];

export default config;
