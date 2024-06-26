import { basename } from 'node:path';

import type { InvalidTestCase } from '@typescript-eslint/rule-tester';

import { VitestRuleTester } from '../../helpers/test/vitest-rule-tester.js';
import {
  disallowedTypeNames,
  noExplicitTypeOnFunctionComponentIdentifierRule,
} from './no-explicit-type-on-function-component-identifier.js';

const ruleTester = new VitestRuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
});

const functionComponentTypes = [
  'FC',
  'React.FC',
  'FunctionComponent',
  'React.FunctionComponent',
];

ruleTester.run(
  basename(__dirname),
  noExplicitTypeOnFunctionComponentIdentifierRule,
  {
    valid: [
      {
        name: 'No explicit type',
        code: 'const MyComponent = () => <div />',
      },
      {
        name: 'Custom named type',
        code: 'const MyComponent: NotAComponentType = () => <div />',
      },
      {
        name: 'Custom type expression',
        code: 'const MyComponent: () => React.ReactElement = () => <div />',
      },
    ],
    invalid: Array.from(
      (function* invalidTestCaseGenerator(): Generator<
        InvalidTestCase<'avoidExplicitFunctionComponentType', []>
      > {
        for (const typeName of disallowedTypeNames) {
          yield {
            name: `${typeName} - arrow function`,
            code: `const MyComponent: ${typeName} = () => <div />`,
            output: 'const MyComponent = () => <div />',
            errors: [{ messageId: 'avoidExplicitFunctionComponentType' }],
          };

          if (functionComponentTypes.includes(typeName)) {
            yield {
              name: `${typeName} - arrow function + generic`,
              code: `const MyComponent: ${typeName}<IProps> = (props) => <div />`,
              output: 'const MyComponent = (props: IProps) => <div />',
              errors: [{ messageId: 'avoidExplicitFunctionComponentType' }],
            };

            yield {
              name: `${typeName} - arrow function + generic + redundant type annotation`,
              code: `const MyComponent: ${typeName}<IProps> = (props: JProps) => <div />`,
              output: 'const MyComponent = (props: JProps) => <div />',
              errors: [{ messageId: 'avoidExplicitFunctionComponentType' }],
            };

            yield {
              name: `${typeName} - arrow function + generic + destructured props`,
              code: `const MyComponent: ${typeName}<IProps> = ({ name }) => <div />`,
              output: 'const MyComponent = ({ name }: IProps) => <div />',
              errors: [{ messageId: 'avoidExplicitFunctionComponentType' }],
            };

            yield {
              name: `${typeName} - arrow function + generic + destructured props + redundant type annotation`,
              code: `const MyComponent: ${typeName}<IProps> = ({ name }: JProps) => <div />`,
              output: 'const MyComponent = ({ name }: JProps) => <div />',
              errors: [{ messageId: 'avoidExplicitFunctionComponentType' }],
            };
          }

          yield {
            name: `${typeName} - function`,
            code: `const MyComponent: ${typeName} = function () { return <div /> }`,
            output: 'const MyComponent = function () { return <div /> }',
            errors: [{ messageId: 'avoidExplicitFunctionComponentType' }],
          };
          if (functionComponentTypes.includes(typeName)) {
            yield {
              name: `${typeName} - function + generic`,
              code: `const MyComponent: ${typeName}<IProps> = function (props) { return <div /> }`,
              output:
                'const MyComponent = function (props: IProps) { return <div /> }',
              errors: [{ messageId: 'avoidExplicitFunctionComponentType' }],
            };

            yield {
              name: `${typeName} - function + generic + redundant type annotation`,
              code: `const MyComponent: ${typeName}<IProps> = function (props: JProps) { return <div /> }`,
              output:
                'const MyComponent = function (props: JProps) { return <div /> }',
              errors: [{ messageId: 'avoidExplicitFunctionComponentType' }],
            };

            yield {
              name: `${typeName} - function + generic + destructured props`,
              code: `const MyComponent: ${typeName}<IProps> = function ({ name }) { return <div /> }`,
              output:
                'const MyComponent = function ({ name }: IProps) { return <div /> }',
              errors: [{ messageId: 'avoidExplicitFunctionComponentType' }],
            };

            yield {
              name: `${typeName} - function + generic + destructured props + redundant type annotation`,
              code: `const MyComponent: ${typeName}<IProps> = function ({ name }: JProps) { return <div /> }`,
              output:
                'const MyComponent = function ({ name }: JProps) { return <div /> }',
              errors: [{ messageId: 'avoidExplicitFunctionComponentType' }],
            };
          }
        }
      })(),
    ),
  },
);
