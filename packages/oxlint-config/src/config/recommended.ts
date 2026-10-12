import type { OxlintOverride } from 'oxlint';

import nodeMixin from './mixin/node.js';
import reactMixin from './mixin/react.js';
import scriptMixin from './mixin/script.js';

/**
 * Files that are matched without a profile, only used when `recommended` is set.
 * Mirrors the file groups of `@rightcapital/eslint-config`,
 * and comes before the profiles, so a profile can still override it.
 *
 * `./` anchors a pattern to the root directory, patterns without it match in any directory.
 *
 * The relaxation for test files is not carried over,
 * Oxlint has no `import/no-extraneous-dependencies` rule that needs it.
 */
export const recommendedMixins = [nodeMixin, reactMixin, scriptMixin] as const;

export const recommendedOverrides: readonly OxlintOverride[] = [
  {
    files: ['**/*.tsx'],
    rules: reactMixin.rules,
  },
  {
    // files in the root directory, typically work in node environment
    files: ['./*.{js,cjs,mjs,ts,cts,mts}'],
    env: nodeMixin.env,
    rules: nodeMixin.rules,
  },
  {
    files: [
      // files in the root directory, typically used for configuration
      './*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
      '**/eslint.config.{js,cjs,mjs,ts,cts,mts}',
      '**/oxlint.config.{js,cjs,mjs,ts,cts,mts}',
    ],
    rules: scriptMixin.rules,
  },
];
