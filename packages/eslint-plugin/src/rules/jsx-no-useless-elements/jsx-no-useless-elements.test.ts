import { RuleTester } from 'eslint';
import jsxNoUselessElementsRule from './jsx-no-useless-elements';
import { describe, test } from 'vitest';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

describe('jsx-no-useless-elements', () => {
  test('jsx-no-useless-elements', () => {
    ruleTester.run('jsx-no-useless-elements', jsxNoUselessElementsRule, {
      valid: [
        {
          name: 'JSX element is assigned to a variable',
          code: 'const element = <div />',
        },
        {
          name: 'JSX element is returned from a function',
          code: 'function Foo() { return <div /> }',
        },
        {
          name: 'JSX element is returned from a function',
          code: 'const Foo = () => <div />',
        },
      ],
      invalid: [
        {
          name: 'JSX element is not assigned to a variable',
          code: '<div />',
          errors: 1,
        },
      ],
    });
  });
});
