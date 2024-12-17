import type { TSESLint } from '@typescript-eslint/utils';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';

import eslintPluginImportX from '../../plugins/eslint-plugin-import-x.js';

// extracted from eslint-config-airbnb-base@15.0.0
// https://github.com/airbnb/javascript/blob/eslint-config-airbnb-base-v15.0.0/packages/eslint-config-airbnb-base/rules/imports.js
const config: TSESLint.FlatConfig.ConfigArray = [
  {
    plugins: {
      'import-x': eslintPluginImportX,
      'simple-import-sort': eslintPluginSimpleImportSort,
    },

    rules: {
      // Static analysis:

      // ensure imports point to files/modules that can be resolved
      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-unresolved.md
      'import-x/no-unresolved': [
        'error',
        { commonjs: true, caseSensitive: true },
      ],

      // ensure named imports coupled with named exports
      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/named.md
      'import-x/named': 'error',

      // Helpful warnings:

      // disallow invalid exports, e.g. multiple defaults
      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/export.md
      'import-x/export': 'error',

      // do not allow a default import name to match a named export
      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-named-as-default.md
      'import-x/no-named-as-default': 'error',

      // warn on accessing default export property names that are also named exports
      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-named-as-default-member.md
      'import-x/no-named-as-default-member': 'error',

      // Forbid the use of extraneous packages
      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-extraneous-dependencies.md
      'import-x/no-extraneous-dependencies': [
        'error',
        { devDependencies: false, optionalDependencies: false },
      ],

      // Forbid mutable exports
      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-mutable-exports.md
      'import-x/no-mutable-exports': 'error',

      // Style guide:

      // disallow non-import statements appearing before import statements
      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/first.md
      'import-x/first': 'error',

      // disallow duplicate imports
      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-duplicates.md
      'import-x/no-duplicates': 'error',

      // Ensure consistent use of file extension within the import path
      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/extensions.md
      'import-x/extensions': [
        'warn',
        'ignorePackages',
        {
          ts: 'never',
          tsx: 'never',
          js: 'never',
          jsx: 'never',
        },
      ],

      // Ensure all imports are sorted
      // https://github.com/lydell/eslint-plugin-simple-import-sort?tab=readme-ov-file#usage
      // MEMO: simple-import-sort/imports should not be used with import-x/order
      'import-x/order': 'off',
      'simple-import-sort/imports': [
        'error',
        {
          /**
           * Almost the same as the default config of simple-import-sort.
           *
           * Except for the Highcharts side effect imports,
           * which are grouped after package imports
           *
           * default: https://github.com/lydell/eslint-plugin-simple-import-sort#sorting:~:text=This%20is%20the%20default%20value%20for%20the%20groups%20option%3A
           *
           * highcharts v12 info: https://www.highcharts.com/blog/changelog/#:~:text=When%20importing%20Highcharts%20as%20a%20node%20module%2C%20additional%20modules%20no%20longer%20require%20initialization
           */
          groups: [
            // Side effect imports.
            ['^\\u0000'],
            // Node.js builtins prefixed with `node:`.
            ['^node:'],

            // Packages.
            // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
            ['^@?\\w'],

            // Highcharts side effect imports
            ['^\\u0000highcharts/'],

            // Absolute imports and other imports such as Vue-style `@/foo`.
            // Anything not matched in another group.
            ['^'],

            // Relative imports.
            // Anything that starts with a dot.
            ['^\\.'],
          ],
        },
      ],

      // Ensure all exports are sorted
      // https://github.com/lydell/eslint-plugin-simple-import-sort?tab=readme-ov-file#usage
      'simple-import-sort/exports': 'error',

      // Require a newline after the last import/require in a group
      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/newline-after-import.md
      'import-x/newline-after-import': 'error',

      // Forbid modules to have too many dependencies
      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/max-dependencies.md
      'import-x/max-dependencies': ['off', { max: 10 }],

      // Forbid import of modules using absolute paths
      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-absolute-path.md
      'import-x/no-absolute-path': 'error',

      // Forbid require() calls with expressions
      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-dynamic-require.md
      'import-x/no-dynamic-require': 'error',

      // Forbid Webpack loader syntax in imports
      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-webpack-loader-syntax.md
      'import-x/no-webpack-loader-syntax': 'error',

      // Prevent importing the default as if it were named
      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-named-default.md
      'import-x/no-named-default': 'error',

      // Forbid a module from importing itself
      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-self-import.md
      'import-x/no-self-import': 'error',

      // Forbid cyclical dependencies between modules
      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-cycle.md
      'import-x/no-cycle': 'error',

      // Ensures that there are no useless path segments
      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-useless-path-segments.md
      'import-x/no-useless-path-segments': ['error', { commonjs: true }],

      // Reports the use of import declarations with CommonJS exports in any module except for the main module.
      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-import-module-exports.md
      'import-x/no-import-module-exports': [
        'error',
        {
          exceptions: [],
        },
      ],

      // Use this rule to prevent importing packages through relative paths.
      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-relative-packages.md
      'import-x/no-relative-packages': 'error',
    },
  },
];

export default config;
