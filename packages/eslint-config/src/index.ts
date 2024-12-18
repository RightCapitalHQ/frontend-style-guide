import type { TSESLint } from '@typescript-eslint/utils';
import globals from 'globals';
import { config } from 'typescript-eslint';

import jsConfig from './config/javascript.js';
import linterConfig from './config/linter.js';
import nodeConfig from './config/mixin/node.js';
import reactConfig from './config/mixin/react.js';
import scriptConfig from './config/mixin/script.js';
import tsConfig from './config/typescript.js';
import { allPlugins } from './plugins/index.js';

interface IMakeConfigOptions {
  react?: boolean;
  a11y?: boolean;
  /**
   * MEMO: merge into target ?
   * actually, it's about module resolution,
   * wo could provide some common patterns for module resolution
   *
   * - webpack: accepts nearly anything, usually do not use extension
   * - deno: accepts importing raw files
   * - tsc: accepts importing compiled files
   */
  moduleResolution?: string;
  target?: 'browser' | 'cli';
}

/**
 *
 */
const makeConfig = (
  options: IMakeConfigOptions,
): TSESLint.FlatConfig.ConfigArray => {
  return [];
};

const recommendedConfig = config(
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
} as const satisfies Record<string, TSESLint.FlatConfig.ConfigArray>;

const utils = {
  /**
   * Utility function for composing configs from `typescript-eslint`.
   *
   * @see https://typescript-eslint.io/packages/typescript-eslint#config
   */
  config,
  globals,
  makeConfig,
  /**
   * all plugins used in @rightcapital/eslint-config
   *
   * useful for overriding rules
   *
   * MEMO: provide a utility function for overriding rules? (instead of using `plugins` directly)
   */
  plugins: allPlugins,
} as const;

export { configs, utils };
export default { configs, utils };
