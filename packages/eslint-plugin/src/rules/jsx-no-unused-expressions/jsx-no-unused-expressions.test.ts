import { basename } from 'node:path';

import parser from '@typescript-eslint/parser';

import { VitestRuleTester } from '../../helpers/test/vitest-rule-tester';
import { jsxNoUnusedExpressionsRule } from './jsx-no-unused-expressions';

const ruleTester = new VitestRuleTester({
  languageOptions: {
    parser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

ruleTester.run(basename(__dirname), jsxNoUnusedExpressionsRule, {
  valid: [
    {
      name: 'Assigned to a variable',
      code: 'const element = <div />',
    },
    {
      name: 'Returned from a function',
      code: 'function Foo() { return <div /> }',
    },
    {
      name: 'Returned from an arrow function',
      code: 'const Foo = () => <div />',
    },
  ],
  invalid: [
    {
      name: 'Not assigned to a variable',
      code: '<div />',
      errors: [{ messageId: 'unusedExpression' }],
    },
  ],
});
