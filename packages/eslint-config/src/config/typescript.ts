import type { ConfigObject } from '@eslint/core';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import * as typescriptEslint from 'typescript-eslint';

import { isInEditorEnv } from '../helpers/is-in-editor-env.js';
import { pickPlugins } from '../utils.js';
import baseConfig from './base/index.js';

/**
 * Common rules for TypeScript files.
 */
const editorConfig: readonly ConfigObject[] = [
  ...baseConfig,
  ...typescriptEslint.configs.recommendedTypeChecked,
  {
    plugins: pickPlugins([
      '@typescript-eslint',
      '@rightcapital',
      'import-x',
      'unused-imports',
    ]),
    languageOptions: {
      parser: typescriptEslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    settings: {
      'import-x/extensions': [
        '.js',
        '.jsx',
        '.cjs',
        '.mjs',
        '.ts',
        '.cts',
        '.mts',
        '.tsx',
      ],
      'import-x/external-module-folders': [
        'node_modules',
        'node_modules/@types',
      ],
      'import-x/parsers': {
        '@typescript-eslint/parser': ['.ts', '.cts', '.mts', '.tsx'],
      },
      'import-x/resolver-next': [createTypeScriptImportResolver()],
    },
    /**
     * Be careful when adding extension rules from `@typescript-eslint`,
     * make sure the ESLint core rules are disabled first.
     *
     * @see https://typescript-eslint.io/rules/#extension-rules
     */
    rules: {
      // https://typescript-eslint.io/rules/restrict-template-expressions/
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          // default options
          allowAny: true,
          allowBoolean: true,
          allowNullish: true,
          allowNumber: true,
          allowRegExp: true,

          // extra options for flexibility
          allowNever: true,
        },
      ],

      // https://typescript-eslint.io/rules/no-non-null-assertion
      '@typescript-eslint/no-non-null-assertion': 'error',

      '@typescript-eslint/naming-convention': [
        'error',
        {
          // interface starts with `I`
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: true,
          },
        },
      ],

      // https://typescript-eslint.io/rules/consistent-type-definitions/
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

      // https://typescript-eslint.io/rules/no-shadow/
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',

      // https://typescript-eslint.io/rules/no-empty-function/
      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function': 'error',

      // https://typescript-eslint.io/rules/no-unused-vars/
      // https://github.com/sweepline/eslint-plugin-unused-imports#usage
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // https://typescript-eslint.io/rules/no-useless-constructor/
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor': ['error'],

      // https://typescript-eslint.io/rules/no-use-before-define/
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': [
        'error',
        {
          functions: false,
          classes: false,
          /**
           * set `variables:false` allows such code, which is safe:
           *   const a = () => b()
           *   const b = () => 2
           *
           * but not this
           * (always an ESLint error, unless with `no-use-before-define: "off"`),
           * which is actually dangerous code:
           *   const c = d()
           *   const d = () => 2
           */
          variables: false,
          typedefs: false,
        },
      ],

      // replacement for deprecated `no-return-await` core rule
      // https://typescript-eslint.io/rules/return-await/
      '@typescript-eslint/return-await': ['error', 'always'],

      // https://github.com/RightCapitalHQ/frontend-style-guide/issues/55
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/consistent-type-exports': [
        'error',
        { fixMixedExportsWithInlineTypeSpecifier: true },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      'import-x/no-duplicates': ['error', { 'prefer-inline': true }],
      '@rightcapital/no-explicit-type-on-function-component-identifier':
        'error',

      /**
       * This rule enforces ES6 style imports, not applicable to CommonJS projects.
       */
      '@typescript-eslint/no-require-imports': 'off',

      // This rule is not suitable for TypeScript
      // https://github.com/antfu/eslint-plugin-import-x/blob/master/docs/rules/named.md
      'import-x/named': 'off',

      // consistent accessibility modifiers for class members
      // https://typescript-eslint.io/rules/explicit-member-accessibility/
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'explicit' },
      ],
    },
  },
];

const nonEditorConfig: readonly ConfigObject[] = [
  ...editorConfig,
  {
    rules: { 'unused-imports/no-unused-imports': 'error' },
  },
];

const config = isInEditorEnv() ? editorConfig : nonEditorConfig;

export default config;
