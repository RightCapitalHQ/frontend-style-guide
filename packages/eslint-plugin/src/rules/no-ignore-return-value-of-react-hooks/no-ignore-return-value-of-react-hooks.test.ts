import { basename } from 'node:path';

import { VitestRuleTester } from '../../helpers/test/vitest-rule-tester';
import { noIgnoreReturnValueOfReactHooksRule } from './no-ignore-return-value-of-react-hooks';

const ruleTester = new VitestRuleTester();

ruleTester.run(basename(__dirname), noIgnoreReturnValueOfReactHooksRule, {
  valid: [
    {
      name: 'Destructing assigned',
      code: 'const [count, setCount] = useState(0)',
    },
    {
      name: 'Assigned to a variable',
      code: 'const stateAndAction = useState(0)',
    },
    {
      name: 'Returned from a function',
      code: 'function Foo() { return useState(0) }',
    },
    {
      name: 'Returned from an arrow function',
      code: 'const Foo = () => useState(0)',
    },
    {
      name: 'Returned from an arrow function',
      code: 'const Foo = () => useState(0)[0]',
    },
    {
      name: 'Assign the property of the return value to a variable',
      code: 'const foo = useState(0)[0];',
    },
    {
      name: 'Assign the property of the return value to a variable with optional chaining',
      code: 'const foo = useState(0)[0]?.foo;',
    },
  ],
  invalid: [
    {
      name: 'Not assigned to a variable',
      code: 'useState(0)',
      errors: [{ messageId: 'ignoreReturnValue' }],
    },
    {
      name: 'Not assigned to a variable in component',
      code: 'function Foo() { useState(0); }',
      errors: [{ messageId: 'ignoreReturnValue' }],
    },
    {
      name: 'Access the property of the return value',
      code: 'useState(0)[0];',
      errors: [{ messageId: 'ignoreReturnValue' }],
    },
    {
      name: 'Access the property of the return value with optional chaining',
      code: 'useState(0)[0]?.foo;',
      errors: [{ messageId: 'ignoreReturnValue' }],
    },
  ],
});
