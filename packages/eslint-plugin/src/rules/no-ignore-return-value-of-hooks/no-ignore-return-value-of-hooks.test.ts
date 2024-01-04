import { RuleTester } from 'eslint';
import noIgnoreReturnValueOfHooksRule from './no-ignore-return-value-of-hooks';
import { describe, test } from 'vitest';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
  },
});

describe('no-ignore-return-value-of-hooks', () => {
  test('no-ignore-return-value-of-hooks', () => {
    ruleTester.run(
      'no-ignore-return-value-of-hooks',
      noIgnoreReturnValueOfHooksRule,
      {
        valid: [
          {
            name: 'JSX element is assigned to a variable',
            code: 'const [count, setCount] = useState(0)',
          },
          {
            name: 'JSX element is assigned to a variable',
            code: 'const stateAndAction = useState(0)',
          },
          {
            name: 'JSX element is returned from a function',
            code: 'function useSingleton() { return useState(0) }',
          },
          {
            name: 'JSX element is returned from a function',
            code: 'const useSingleton = () => useState(0)',
          },
        ],
        invalid: [
          {
            name: 'JSX element is not assigned to a variable',
            code: 'useState(0)',
            errors: 1,
          },
        ],
      },
    );
  });
});
