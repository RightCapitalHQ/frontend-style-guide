import type { ConfigObject } from '@eslint/core';

import { pickPlugins } from '../../utils.js';

// extracted from eslint-config-airbnb-base@15.0.0
// https://github.com/airbnb/javascript/blob/eslint-config-airbnb-base-v15.0.0/packages/eslint-config-airbnb-base/rules/style.js
const config: readonly ConfigObject[] = [
  {
    plugins: pickPlugins(['@stylistic']),

    rules: {
      // require camel case names
      camelcase: ['error', { properties: 'never', ignoreDestructuring: false }],

      // require function expressions to have a name
      // https://eslint.org/docs/rules/func-names
      'func-names': 'warn',

      // require an empty line between class members
      // https://eslint.style/rules/default/lines-between-class-members
      '@stylistic/lines-between-class-members': ['error', 'always'],

      // require newlines around directives
      // https://eslint.style/rules/default/padding-line-between-statements
      '@stylistic/padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: 'directive',
          next: '*',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'directive',
        },
        {
          blankLine: 'any',
          prev: 'directive',
          next: 'directive',
        },
      ],

      // require a capital letter for constructors
      'new-cap': [
        'error',
        {
          newIsCap: true,
          newIsCapExceptions: [],
          capIsNew: false,
          capIsNewExceptions: [
            'Immutable.Map',
            'Immutable.Set',
            'Immutable.List',
          ],
        },
      ],

      // disallow use of the Array constructor
      'no-array-constructor': 'error',

      // disallow use of bitwise operators
      // https://eslint.org/docs/rules/no-bitwise
      'no-bitwise': 'error',

      // disallow use of the continue statement
      // https://eslint.org/docs/rules/no-continue
      'no-continue': 'error',

      // disallow if as the only statement in an else block
      // https://eslint.org/docs/rules/no-lonely-if
      'no-lonely-if': 'error',

      // disallow use of chained assignment expressions
      // https://eslint.org/docs/rules/no-multi-assign
      'no-multi-assign': ['error'],

      // disallow nested ternary expressions
      'no-nested-ternary': 'error',

      // disallow calling the Object constructor without an argument
      // https://eslint.org/docs/latest/rules/no-object-constructor
      'no-object-constructor': 'error',

      // disallow use of unary operators, ++ and --
      // https://eslint.org/docs/rules/no-plusplus
      'no-plusplus': 'error',

      // disallow certain syntax forms
      // https://eslint.org/docs/rules/no-restricted-syntax
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message:
            'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
        },
        {
          selector: 'LabeledStatement',
          message:
            'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
        },
        {
          selector: 'WithStatement',
          message:
            '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
        },
        {
          /** https://stackoverflow.com/a/72903871/2488867 */
          selector:
            "MemberExpression[object.property.name='constructor'][property.name='name']",
          message: 'constructor name is not reliable, do not use it.',
        },
      ],

      // disallow dangling underscores in identifiers
      // https://eslint.org/docs/rules/no-underscore-dangle
      'no-underscore-dangle': [
        'error',
        {
          allow: [],
          allowAfterThis: false,
          allowAfterSuper: false,
          enforceInMethodNames: true,
        },
      ],

      // disallow the use of Boolean literals in conditional expressions
      // also, prefer `a || b` over `a ? a : b`
      // https://eslint.org/docs/rules/no-unneeded-ternary
      'no-unneeded-ternary': ['error', { defaultAssignment: false }],

      // allow just one var statement per function
      'one-var': ['error', 'never'],

      // require assignment operator shorthand where possible or prohibit it entirely
      // https://eslint.org/docs/rules/operator-assignment
      'operator-assignment': ['error', 'always'],

      // Disallow the use of Math.pow in favor of the ** operator
      // https://eslint.org/docs/rules/prefer-exponentiation-operator
      'prefer-exponentiation-operator': 'error',

      // Prefer use of an object spread over Object.assign
      // https://eslint.org/docs/rules/prefer-object-spread
      'prefer-object-spread': 'error',

      // require or disallow a space immediately following the // or /* in a comment
      // https://eslint.style/rules/default/spaced-comment
      '@stylistic/spaced-comment': [
        'error',
        'always',
        {
          line: {
            exceptions: ['-', '+'],
            markers: ['=', '!', '/'], // space here to support sprockets directives, slash for TS /// comments
          },
          block: {
            exceptions: ['-', '+'],
            markers: ['=', '!', ':', '::'], // space here to support sprockets directives and flow comment types
            balanced: true,
          },
        },
      ],

      // require or disallow the Unicode Byte Order Mark
      // https://eslint.org/docs/rules/unicode-bom
      'unicode-bom': ['error', 'never'],
    },
  },
];

export default config;
