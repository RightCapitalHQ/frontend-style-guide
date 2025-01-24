import type { TSESLint } from '@typescript-eslint/utils';

import { pickPlugins } from '../../utils.js';

// extracted from eslint-config-airbnb-base@15.0.0
// https://github.com/airbnb/javascript/blob/eslint-config-airbnb-base-v15.0.0/packages/eslint-config-airbnb-base/rules/best-practices.js
const config: TSESLint.FlatConfig.ConfigArray = [
  {
    plugins: pickPlugins(['lodash', 'unicorn']),
    rules: {
      // enforces return statements in callbacks of array's methods
      // https://eslint.org/docs/rules/array-callback-return
      'array-callback-return': ['error', { allowImplicit: true }],

      // treat var statements as if they were block scoped
      // https://eslint.org/docs/rules/block-scoped-var
      'block-scoped-var': 'error',

      // require return statements to either always or never specify values
      // https://eslint.org/docs/rules/consistent-return
      'consistent-return': 'error',

      // specify curly brace conventions for all control statements
      // https://eslint.org/docs/rules/curly
      curly: ['error', 'all'],

      // require default case in switch statements
      // https://eslint.org/docs/rules/default-case
      'default-case': ['error', { commentPattern: '^no default$' }],

      // Enforce default clauses in switch statements to be last
      // https://eslint.org/docs/rules/default-case-last
      'default-case-last': 'error',

      // encourages use of dot notation whenever possible
      // https://eslint.org/docs/rules/dot-notation
      'dot-notation': ['error', { allowKeywords: true }],

      // require the use of === and !==
      // https://eslint.org/docs/rules/eqeqeq
      eqeqeq: ['error', 'always', { null: 'ignore' }],

      // Require grouped accessor pairs in object literals and classes
      // https://eslint.org/docs/rules/grouped-accessor-pairs
      'grouped-accessor-pairs': 'error',

      // make sure for-in loops have an if statement
      // https://eslint.org/docs/rules/guard-for-in
      'guard-for-in': 'error',

      // enforce a maximum number of classes per file
      // https://eslint.org/docs/rules/max-classes-per-file
      'max-classes-per-file': ['error', 1],

      // disallow the use of alert, confirm, and prompt
      // https://eslint.org/docs/rules/no-alert
      'no-alert': 'warn',

      // disallow use of arguments.caller or arguments.callee
      // https://eslint.org/docs/rules/no-caller
      'no-caller': 'error',

      // disallow lexical declarations in case/default clauses
      // https://eslint.org/docs/rules/no-case-declarations
      'no-case-declarations': 'error',

      // Disallow returning value in constructor
      // https://eslint.org/docs/rules/no-constructor-return
      'no-constructor-return': 'error',

      // disallow else after a return in an if
      // https://eslint.org/docs/rules/no-else-return
      'no-else-return': ['error', { allowElseIf: false }],

      // disallow empty functions, except for standalone funcs/arrows
      // https://eslint.org/docs/rules/no-empty-function
      'no-empty-function': [
        'error',
        {
          allow: ['arrowFunctions', 'functions', 'methods'],
        },
      ],

      // disallow empty destructuring patterns
      // https://eslint.org/docs/rules/no-empty-pattern
      'no-empty-pattern': 'error',

      // disallow use of eval()
      // https://eslint.org/docs/rules/no-eval
      'no-eval': 'error',

      // disallow adding to native types
      // https://eslint.org/docs/rules/no-extend-native
      'no-extend-native': 'error',

      // disallow unnecessary function binding
      // https://eslint.org/docs/rules/no-extra-bind
      'no-extra-bind': 'error',

      // disallow Unnecessary Labels
      // https://eslint.org/docs/rules/no-extra-label
      'no-extra-label': 'error',

      // disallow fallthrough of case statements
      // https://eslint.org/docs/rules/no-fallthrough
      'no-fallthrough': 'error',

      // disallow reassignments of native objects or read-only globals
      // https://eslint.org/docs/rules/no-global-assign
      'no-global-assign': ['error', { exceptions: [] }],

      // disallow use of eval()-like methods
      // https://eslint.org/docs/rules/no-implied-eval
      'no-implied-eval': 'error',

      // disallow usage of __iterator__ property
      // https://eslint.org/docs/rules/no-iterator
      'no-iterator': 'error',

      // disallow use of labels for anything other than loops and switches
      // https://eslint.org/docs/rules/no-labels
      'no-labels': ['error', { allowLoop: false, allowSwitch: false }],

      // disallow unnecessary nested blocks
      // https://eslint.org/docs/rules/no-lone-blocks
      'no-lone-blocks': 'error',

      // disallow creation of functions within loops
      // https://eslint.org/docs/rules/no-loop-func
      'no-loop-func': 'error',

      // disallow use of multiline strings
      // https://eslint.org/docs/rules/no-multi-str
      'no-multi-str': 'error',

      // disallow use of new operator when not part of the assignment or comparison
      // https://eslint.org/docs/rules/no-new
      'no-new': 'error',

      // disallow use of new operator for Function object
      // https://eslint.org/docs/rules/no-new-func
      'no-new-func': 'error',

      // disallows creating new instances of String, Number, and Boolean
      // https://eslint.org/docs/rules/no-new-wrappers
      'no-new-wrappers': 'error',

      // Disallow \8 and \9 escape sequences in string literals
      // https://eslint.org/docs/rules/no-nonoctal-decimal-escape
      'no-nonoctal-decimal-escape': 'error',

      // disallow use of (old style) octal literals
      // https://eslint.org/docs/rules/no-octal
      'no-octal': 'error',

      // disallow use of octal escape sequences in string literals, such as
      // var foo = 'Copyright \251';
      // https://eslint.org/docs/rules/no-octal-escape
      'no-octal-escape': 'error',

      // disallow reassignment of function parameters
      // disallow parameter object manipulation except for specific exclusions
      // rule: https://eslint.org/docs/rules/no-param-reassign.html
      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsFor: [
            'acc', // for reduce accumulators
            'accumulator', // for reduce accumulators
            'e', // for e.returnvalue
            'ctx', // for Koa routing
            'context', // for Koa routing
            'req', // for Express requests
            'request', // for Express requests
            'res', // for Express responses
            'response', // for Express responses
            '$scope', // for Angular 1 scopes
            'staticContext', // for ReactRouter context
          ],
        },
      ],

      // disallow usage of __proto__ property
      // https://eslint.org/docs/rules/no-proto
      'no-proto': 'error',

      // disallow declaring the same variable more than once
      // https://eslint.org/docs/rules/no-redeclare
      'no-redeclare': 'error',

      // disallow certain object properties
      // https://eslint.org/docs/rules/no-restricted-properties
      'no-restricted-properties': [
        'error',
        {
          object: 'arguments',
          property: 'callee',
          message: 'arguments.callee is deprecated',
        },
        {
          object: 'global',
          property: 'isFinite',
          message: 'Please use Number.isFinite instead',
        },
        {
          object: 'self',
          property: 'isFinite',
          message: 'Please use Number.isFinite instead',
        },
        {
          object: 'window',
          property: 'isFinite',
          message: 'Please use Number.isFinite instead',
        },
        {
          object: 'global',
          property: 'isNaN',
          message: 'Please use Number.isNaN instead',
        },
        {
          object: 'self',
          property: 'isNaN',
          message: 'Please use Number.isNaN instead',
        },
        {
          object: 'window',
          property: 'isNaN',
          message: 'Please use Number.isNaN instead',
        },
        {
          property: '__defineGetter__',
          message: 'Please use Object.defineProperty instead.',
        },
        {
          property: '__defineSetter__',
          message: 'Please use Object.defineProperty instead.',
        },
        {
          object: 'Math',
          property: 'pow',
          message: 'Use the exponentiation operator (**) instead.',
        },
      ],

      // disallow use of assignment in return statement
      // https://eslint.org/docs/rules/no-return-assign
      'no-return-assign': ['error', 'always'],

      // disallow redundant `return await`
      // https://eslint.org/docs/rules/no-return-await
      'no-return-await': 'error',

      // disallow use of `javascript:` urls.
      // https://eslint.org/docs/rules/no-script-url
      'no-script-url': 'error',

      // disallow self assignment
      // https://eslint.org/docs/rules/no-self-assign
      'no-self-assign': [
        'error',
        {
          props: true,
        },
      ],

      // disallow comparisons where both sides are exactly the same
      // https://eslint.org/docs/rules/no-self-compare
      'no-self-compare': 'error',

      // disallow use of comma operator
      // https://eslint.org/docs/rules/no-sequences
      'no-sequences': 'error',

      // restrict what can be thrown as an exception
      // https://eslint.org/docs/rules/no-throw-literal
      'no-throw-literal': 'error',

      // disallow usage of expressions in statement position
      // https://eslint.org/docs/rules/no-unused-expressions
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: false,
          allowTernary: false,
          allowTaggedTemplates: false,
        },
      ],

      // disallow unused labels
      // https://eslint.org/docs/rules/no-unused-labels
      'no-unused-labels': 'error',

      // Disallow unnecessary catch clauses
      // https://eslint.org/docs/rules/no-useless-catch
      'no-useless-catch': 'error',

      // disallow useless string concatenation
      // https://eslint.org/docs/rules/no-useless-concat
      'no-useless-concat': 'error',

      // disallow unnecessary string escaping
      // https://eslint.org/docs/rules/no-useless-escape
      'no-useless-escape': 'error',

      // disallow redundant return; keywords
      // https://eslint.org/docs/rules/no-useless-return
      'no-useless-return': 'error',

      // disallow use of void operator
      // https://eslint.org/docs/rules/no-void
      'no-void': 'error',

      // disallow use of the with statement
      // https://eslint.org/docs/rules/no-with
      'no-with': 'error',

      // require using Error objects as Promise rejection reasons
      // https://eslint.org/docs/rules/prefer-promise-reject-errors
      'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }],

      // https://eslint.org/docs/rules/prefer-regex-literals
      'prefer-regex-literals': [
        'error',
        {
          disallowRedundantWrapping: true,
        },
      ],

      // require use of the second argument for parseInt()
      // https://eslint.org/docs/rules/radix
      radix: 'error',

      // requires to declare all vars on top of their containing scope
      // https://eslint.org/docs/rules/vars-on-top
      'vars-on-top': 'error',

      // require or disallow Yoda conditions
      // https://eslint.org/docs/rules/yoda
      yoda: 'error',

      // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-node-protocol.md
      'unicorn/prefer-node-protocol': 'error',

      // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/text-encoding-identifier-case.md
      'unicorn/text-encoding-identifier-case': 'error',

      // https://github.com/RightCapitalHQ/frontend-style-guide/issues/171
      'lodash/prop-shorthand': ['error', 'never'],
    },
  },
];

export default config;
