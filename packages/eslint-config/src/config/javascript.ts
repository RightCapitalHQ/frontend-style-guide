import type { TSESLint } from '@typescript-eslint/utils';
import { createOxcImportResolver } from 'eslint-import-resolver-oxc';

import baseConfig from './base/index.js';

/**
 * Common rules for JavaScript files.
 */
const config: TSESLint.FlatConfig.ConfigArray = [
  ...baseConfig,
  {
    settings: {
      'import-x/resolver-next': [createOxcImportResolver()],
      'import-x/extensions': ['.js', '.mjs', '.jsx'],
      'import-x/ignore': [
        'node_modules',
        '\\.(coffee|scss|css|less|hbs|svg|json)$',
      ],
    },
  },
];

export default config;
