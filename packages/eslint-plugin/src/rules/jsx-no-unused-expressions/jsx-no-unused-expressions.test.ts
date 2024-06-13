import { basename } from 'node:path';

import { VitestRuleTester } from '../../helpers/test/vitest-rule-tester';
import { jsxNoUnusedExpressionsRule } from './jsx-no-unused-expressions';

const ruleTester = new VitestRuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
    ecmaFeatures: {
      jsx: true,
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
      errors: 1,
    },
  ],
});
