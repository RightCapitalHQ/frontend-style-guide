import type { TSESLint } from '@typescript-eslint/utils';

import baseConfig from './base/index.js';

/**
 * Common rules for JavaScript files.
 */
const config: TSESLint.FlatConfig.ConfigArray = [
  ...baseConfig,
  {
    settings: {
      'import-x/resolver': {
        node: {
          extensions: ['.mjs', '.js', '.json'],
        },
        typescript: {},
      },
      'import-x/extensions': ['.js', '.mjs', '.jsx'],
      'import-x/ignore': [
        'node_modules',
        '\\.(coffee|scss|css|less|hbs|svg|json)$',
      ],
    },
  },
];

export default config;
