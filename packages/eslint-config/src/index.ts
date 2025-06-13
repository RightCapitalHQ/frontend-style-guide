import type { TSESLint } from '@typescript-eslint/utils';

import jsConfig from './config/javascript.js';
import linterConfig from './config/linter.js';
import disableExpensiveRulesConfig from './config/mixin/disable-expensive-rules.js';
import nodeConfig from './config/mixin/node.js';
import reactConfig from './config/mixin/react.js';
import scriptConfig from './config/mixin/script.js';
import tsConfig from './config/typescript.js';
import utils from './utils.js';

const recommendedConfig = utils.defineConfig(
  ...linterConfig,
  {
    files: ['**/*.{js,cjs,mjs,jsx}'],
    extends: [...jsConfig],
  },
  {
    files: ['**/*.{ts,cts,mts,tsx}'],
    extends: [...tsConfig],
  },
  {
    files: ['**/*.tsx'],
    extends: [...reactConfig],
  },
  {
    // test files
    files: [
      'test/**', // tape, common npm pattern
      'tests/**', // also common npm pattern
      'spec/**', // mocha, rspec-like pattern
      '**/__tests__/**', // jest pattern
      '**/__mocks__/**', // jest pattern
      'test.{js,cjs,mjs,jsx,ts,cts,mts,tsx}', // repos with a single test file
      'test-*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}', // repos with multiple top-level test files
      '**/*{.,_}{test,spec}.{js,cjs,mjs,jsx,ts,cts,mts,tsx}', // tests where the extension or filename suffix denotes that it is a test
    ],
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        { devDependencies: true },
      ],
    },
  },
  {
    // scripts
    files: [
      '*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}', // files in the root directory, typically used for configuration

      // eslint config(legacy)
      // https://eslint.org/docs/latest/use/configure/configuration-files-deprecated
      '**/.eslintrc.{js,cjs}',
      // eslint config(flat config, new)
      '**/eslint.config.{js,cjs,mjs}',
    ],
    extends: [...scriptConfig],
  },
  {
    files: ['*.{js,cjs,mjs,ts,cts,mts}'], // files in the root directory, typically work in node environment
    extends: [...nodeConfig],
  },
);

const configs = {
  recommended: recommendedConfig,
  js: jsConfig,
  ts: tsConfig,
  node: nodeConfig,
  react: reactConfig,
  script: scriptConfig,
  disableExpensiveRules: disableExpensiveRulesConfig,
} as const satisfies Record<string, TSESLint.FlatConfig.ConfigArray>;

export { configs, utils };
export default { configs, utils };
