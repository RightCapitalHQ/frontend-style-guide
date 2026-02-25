import type { ConfigObject } from '@eslint/core';

import { pickPlugins } from '../../utils.js';

// extracted from eslint-config-airbnb-base@15.0.0
// https://github.com/airbnb/javascript/blob/eslint-config-airbnb-base-v15.0.0/packages/eslint-config-airbnb-base/rules/es6.js
const config: readonly ConfigObject[] = [
  {
    plugins: pickPlugins(['unicorn']),

    rules: {
      // verify super() callings in constructors
      'constructor-super': 'error',

      // disallow modifying variables of class declarations
      // https://eslint.org/docs/rules/no-class-assign
      'no-class-assign': 'error',

      // disallow modifying variables that are declared using const
      'no-const-assign': 'error',

      // disallow duplicate class members
      // https://eslint.org/docs/rules/no-dupe-class-members
      'no-dupe-class-members': 'error',

      // disallow new operators with global non-constructor functions
      // https://eslint.org/docs/latest/rules/no-new-native-nonconstructor
      'no-new-native-nonconstructor': 'error',

      // Disallow specified names in exports
      // https://eslint.org/docs/rules/no-restricted-exports
      'no-restricted-exports': [
        'error',
        {
          restrictedNamedExports: [
            'default', // use `export default` to provide a default export
            'then', // this will cause tons of confusion when your module is dynamically `import()`ed, and will break in most node ESM versions
          ],
        },
      ],

      // disallow to use this/super before super() calling in constructors.
      // https://eslint.org/docs/rules/no-this-before-super
      'no-this-before-super': 'error',

      // disallow useless computed property keys
      // https://eslint.org/docs/rules/no-useless-computed-key
      'no-useless-computed-key': 'error',

      // disallow unnecessary constructor
      // https://eslint.org/docs/rules/no-useless-constructor
      'no-useless-constructor': 'error',

      // enforce setting property defaults with the class fields
      // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-class-fields.md
      'unicorn/prefer-class-fields': 'error',

      // enforce correct Error subclassing
      // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/custom-error-definition.md
      'unicorn/custom-error-definition': 'error',

      // disallow renaming import, export, and destructured assignments to the same name
      // https://eslint.org/docs/rules/no-useless-rename
      'no-useless-rename': [
        'error',
        {
          ignoreDestructuring: false,
          ignoreImport: false,
          ignoreExport: false,
        },
      ],

      // require let or const instead of var
      'no-var': 'error',

      // require method and property shorthand syntax for object literals
      // https://eslint.org/docs/rules/object-shorthand
      'object-shorthand': [
        'error',
        'always',
        {
          ignoreConstructors: false,
          avoidQuotes: true,
        },
      ],

      // suggest using of const declaration for variables that are never modified after declared
      'prefer-const': [
        'error',
        {
          destructuring: 'any',
          ignoreReadBeforeAssign: true,
        },
      ],

      // Prefer destructuring from arrays and objects
      // https://eslint.org/docs/rules/prefer-destructuring
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: {
            array: false,
            object: true,
          },
          AssignmentExpression: {
            array: true,
            object: false,
          },
        },
        {
          enforceForRenamedProperties: false,
        },
      ],

      // disallow parseInt() in favor of binary, octal, and hexadecimal literals
      // https://eslint.org/docs/rules/prefer-numeric-literals
      'prefer-numeric-literals': 'error',

      // use rest parameters instead of arguments
      // https://eslint.org/docs/rules/prefer-rest-params
      'prefer-rest-params': 'error',

      // suggest using the spread syntax instead of .apply()
      // https://eslint.org/docs/rules/prefer-spread
      'prefer-spread': 'error',

      // suggest using template literals instead of string concatenation
      // https://eslint.org/docs/rules/prefer-template
      'prefer-template': 'error',

      // disallow generator functions that do not have yield
      // https://eslint.org/docs/rules/require-yield
      'require-yield': 'error',

      // require a Symbol description
      // https://eslint.org/docs/rules/symbol-description
      'symbol-description': 'error',

      // prefer `Array.prototype.includes()` over `Array.prototype.indexOf()` for checking (non-)existence
      // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-includes.md
      'unicorn/prefer-includes': 'error',

      // prefer .some(…) over .filter(…).length check and .{find,findLast,findIndex,findLastIndex}(…)
      // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-array-some.md
      'unicorn/prefer-array-some': 'error',
    },
  },
];

export default config;
