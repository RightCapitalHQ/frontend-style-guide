import type { TSESLint } from '@typescript-eslint/utils';
import confusingBrowserGlobals from 'confusing-browser-globals';

// extracted from eslint-config-airbnb-base@15.0.0
// https://github.com/airbnb/javascript/blob/eslint-config-airbnb-base-v15.0.0/packages/eslint-config-airbnb-base/rules/variables.js
const config: TSESLint.FlatConfig.ConfigArray = [
  {
    rules: {
      // disallow deletion of variables
      'no-delete-var': 'error',

      // disallow labels that share a name with a variable
      // https://eslint.org/docs/rules/no-label-var
      'no-label-var': 'error',

      // disallow specific globals
      'no-restricted-globals': [
        'error',
        {
          name: 'isFinite',
          message:
            'Use Number.isFinite instead https://github.com/airbnb/javascript#standard-library--isfinite',
        },
        {
          name: 'isNaN',
          message:
            'Use Number.isNaN instead https://github.com/airbnb/javascript#standard-library--isnan',
        },
        ...confusingBrowserGlobals,
      ],

      // disallow declaration of variables already declared in the outer scope
      'no-shadow': 'error',

      // disallow shadowing of names such as arguments
      'no-shadow-restricted-names': 'error',

      // disallow use of undeclared variables unless mentioned in a /*global */ block
      'no-undef': 'error',

      // disallow use of undefined when initializing variables
      'no-undef-init': 'error',

      // disallow declaration of variables that are not used in the code
      'no-unused-vars': [
        'error',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: true },
      ],

      // disallow use of variables before they are defined
      'no-use-before-define': [
        'error',
        { functions: true, classes: true, variables: true },
      ],
    },
  },
];

export default config;
