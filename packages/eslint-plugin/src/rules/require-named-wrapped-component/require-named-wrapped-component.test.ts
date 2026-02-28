import { basename } from 'node:path';

import parser from '@typescript-eslint/parser';

import { VitestRuleTester } from '../../helpers/test/vitest-rule-tester';
import { requireNamedWrappedComponentRule } from './require-named-wrapped-component';

type RuleOptions = [{ hocNames: string[] }];

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
const ruleName = basename(__dirname);

const defaultOptions: RuleOptions = [{ hocNames: ['observer'] }];

const optionsWithBuiltinHocs: [
  { hocNames: string[]; includeReactHocs: boolean },
] = [{ hocNames: ['observer'], includeReactHocs: true }];

ruleTester.run(`${ruleName} - valid cases`, requireNamedWrappedComponentRule, {
  valid: [
    // Named function expression
    {
      code: `const EnhancedButton = observer(function EnhancedButton() {
        return <button>Click</button>;
      });`,
      options: defaultOptions,
    },
    // Reference to named component
    {
      code: `const EnhancedButtonBase = () => <button>Click</button>;
const EnhancedButton = observer(EnhancedButtonBase);`,
      options: defaultOptions,
    },
    // forwardRef exception - anonymous allowed
    {
      code: `const EnhancedButton = forwardRef((props, ref) => {
        return <button ref={ref} {...props}>Click</button>;
      });`,
      options: defaultOptions,
    },
    // React.forwardRef exception
    {
      code: `const EnhancedButton = React.forwardRef((props, ref) => {
        return <button ref={ref} {...props}>Click</button>;
      });`,
      options: defaultOptions,
    },
    // memo exception - anonymous allowed
    {
      code: `const ExpensiveComponent = memo(() => {
        return <div>Expensive</div>;
      });`,
      options: defaultOptions,
    },
    // React.memo exception
    {
      code: `const ExpensiveComponent = React.memo(() => {
        return <div>Expensive</div>;
      });`,
      options: defaultOptions,
    },
    // HOC wrapping forwardRef - anonymous allowed inside forwardRef
    {
      code: `const EnhancedButton = observer(
        forwardRef((props, ref) => {
          return <button ref={ref} {...props}>Click</button>;
        })
      );`,
      options: defaultOptions,
    },
    // HOC wrapping React.forwardRef
    {
      code: `const EnhancedButton = observer(
        React.forwardRef((props, ref) => {
          return <button ref={ref} {...props}>Click</button>;
        })
      );`,
      options: defaultOptions,
    },
    // HOC wrapping memo
    {
      code: `const EnhancedButton = observer(
        memo(() => <button>Click</button>)
      );`,
      options: defaultOptions,
    },
    // HOC wrapping React.memo
    {
      code: `const EnhancedButton = observer(
        React.memo(() => <button>Click</button>)
      );`,
      options: defaultOptions,
    },
    // Not a configured HOC factory
    {
      code: `const Something = someOtherHoc(() => <div>Hi</div>);`,
      options: defaultOptions,
    },
    // Empty options - no HOCs configured
    {
      code: `const Something = observer(() => <div>Hi</div>);`,
      options: [{ hocNames: [] }] satisfies RuleOptions,
    },
    // Named function expression with parameters
    {
      code: `const EnhancedButton = observer(function EnhancedButton(props) {
        return <button {...props}>Click</button>;
      });`,
      options: defaultOptions,
    },
  ],

  invalid: [],
});

ruleTester.run(
  `${ruleName} - invalid cases with auto-fix`,
  requireNamedWrappedComponentRule,
  {
    valid: [],

    invalid: [
      // Anonymous arrow function with block body
      {
        code: `const EnhancedButton = observer(() => {
  return <button>Click</button>;
});`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const EnhancedButton = observer(function EnhancedButton() {
  return <button>Click</button>;
});`,
      },
      // Anonymous arrow function with expression body
      {
        code: `const EnhancedButton = observer(() => <button>Click</button>);`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const EnhancedButton = observer(function EnhancedButton() { return <button>Click</button>; });`,
      },
      // Anonymous function expression
      {
        code: `const EnhancedButton = observer(function () {
  return <button>Click</button>;
});`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const EnhancedButton = observer(function EnhancedButton() {
  return <button>Click</button>;
});`,
      },
      // Arrow function with parameters
      {
        code: `const EnhancedButton = observer((props) => {
  return <button {...props}>Click</button>;
});`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const EnhancedButton = observer(function EnhancedButton(props) {
  return <button {...props}>Click</button>;
});`,
      },
      // Async arrow function
      {
        code: `const EnhancedButton = observer(async () => {
  await fetch('/api');
  return <button>Click</button>;
});`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const EnhancedButton = observer(async function EnhancedButton() {
  await fetch('/api');
  return <button>Click</button>;
});`,
      },
      // Multiple HOC factories configured
      {
        code: `const EnhancedButton = connect(() => <button>Click</button>);`,
        options: [{ hocNames: ['observer', 'connect'] }] satisfies RuleOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'connect' },
          },
        ],
        output: `const EnhancedButton = connect(function EnhancedButton() { return <button>Click</button>; });`,
      },
      // Arrow function with multiple parameters
      {
        code: `const EnhancedButton = observer((props, context) => {
  return <button {...props}>Click</button>;
});`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const EnhancedButton = observer(function EnhancedButton(props, context) {
  return <button {...props}>Click</button>;
});`,
      },
      // Arrow function with destructured parameters
      {
        code: `const EnhancedButton = observer(({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
});`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const EnhancedButton = observer(function EnhancedButton({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
});`,
      },
      // Single parameter without parentheses - expression body
      {
        code: `const EnhancedButton = observer(props => <button {...props}>Click</button>);`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const EnhancedButton = observer(function EnhancedButton(props) { return <button {...props}>Click</button>; });`,
      },
      // Single parameter without parentheses - block body
      {
        code: `const EnhancedButton = observer(props => {
  return <button {...props}>Click</button>;
});`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const EnhancedButton = observer(function EnhancedButton(props) {
  return <button {...props}>Click</button>;
});`,
      },
    ],
  },
);

ruleTester.run(
  `${ruleName} - unfixable cases`,
  requireNamedWrappedComponentRule,
  {
    valid: [],

    invalid: [
      // Cannot auto-fix: export default
      {
        code: `export default observer(() => <button>Click</button>);`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        // No output - unfixable (output should be same as input when no fix)
        output: null,
      },
      // Cannot auto-fix: object property
      {
        code: `const components = {
  Button: observer(() => <button>Click</button>),
};`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: null,
      },
      // Cannot auto-fix: array element
      {
        code: `const list = [observer(() => <button>Click</button>)];`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: null,
      },
      // Cannot auto-fix: function argument
      {
        code: `someFunction(observer(() => <button>Click</button>));`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: null,
      },
    ],
  },
);

ruleTester.run(
  `${ruleName} - custom HOC with builtin name`,
  requireNamedWrappedComponentRule,
  {
    valid: [],

    invalid: [
      // Custom HOC named "memo" should still be checked when explicitly configured
      {
        code: `const Foo = myHocs.memo(() => <div/>);`,
        options: [{ hocNames: ['myHocs.memo'] }] satisfies RuleOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'myHocs.memo' },
          },
        ],
        output: `const Foo = myHocs.memo(function Foo() { return <div/>; });`,
      },
      // Custom HOC named "forwardRef" should still be checked when explicitly configured
      {
        code: `const Foo = customLib.forwardRef(() => <div/>);`,
        options: [{ hocNames: ['customLib.forwardRef'] }] satisfies RuleOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'customLib.forwardRef' },
          },
        ],
        output: `const Foo = customLib.forwardRef(function Foo() { return <div/>; });`,
      },
    ],
  },
);

ruleTester.run(
  `${ruleName} - includeReactHocs option`,
  requireNamedWrappedComponentRule,
  {
    valid: [
      // Named function inside forwardRef with includeReactHocs: true
      {
        code: `const EnhancedButton = forwardRef(function EnhancedButton(props, ref) {
        return <button ref={ref} {...props}>Click</button>;
      });`,
        options: optionsWithBuiltinHocs,
      },
      // Named function inside memo with includeReactHocs: true
      {
        code: `const ExpensiveComponent = memo(function ExpensiveComponent() {
        return <div>Expensive</div>;
      });`,
        options: optionsWithBuiltinHocs,
      },
      // Named function inside React.forwardRef with includeReactHocs: true
      {
        code: `const EnhancedButton = React.forwardRef(function EnhancedButton(props, ref) {
        return <button ref={ref} {...props}>Click</button>;
      });`,
        options: optionsWithBuiltinHocs,
      },
      // Named function inside React.memo with includeReactHocs: true
      {
        code: `const ExpensiveComponent = React.memo(function ExpensiveComponent() {
        return <div>Expensive</div>;
      });`,
        options: optionsWithBuiltinHocs,
      },
      // Reference to named component inside forwardRef
      {
        code: `const EnhancedButtonBase = (props, ref) => <button ref={ref}>Click</button>;
const EnhancedButton = forwardRef(EnhancedButtonBase);`,
        options: optionsWithBuiltinHocs,
      },
    ],

    invalid: [
      // Anonymous function inside forwardRef with includeReactHocs: true
      {
        code: `const EnhancedButton = forwardRef((props, ref) => {
  return <button ref={ref} {...props}>Click</button>;
});`,
        options: optionsWithBuiltinHocs,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'forwardRef' },
          },
        ],
        output: `const EnhancedButton = forwardRef(function EnhancedButton(props, ref) {
  return <button ref={ref} {...props}>Click</button>;
});`,
      },
      // Anonymous function inside memo with includeReactHocs: true
      {
        code: `const ExpensiveComponent = memo(() => {
  return <div>Expensive</div>;
});`,
        options: optionsWithBuiltinHocs,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'memo' },
          },
        ],
        output: `const ExpensiveComponent = memo(function ExpensiveComponent() {
  return <div>Expensive</div>;
});`,
      },
      // Anonymous function inside React.forwardRef with includeReactHocs: true
      {
        code: `const EnhancedButton = React.forwardRef((props, ref) => {
  return <button ref={ref} {...props}>Click</button>;
});`,
        options: optionsWithBuiltinHocs,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'React.forwardRef' },
          },
        ],
        output: `const EnhancedButton = React.forwardRef(function EnhancedButton(props, ref) {
  return <button ref={ref} {...props}>Click</button>;
});`,
      },
      // Anonymous function inside React.memo with includeReactHocs: true
      {
        code: `const ExpensiveComponent = React.memo(() => {
  return <div>Expensive</div>;
});`,
        options: optionsWithBuiltinHocs,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'React.memo' },
          },
        ],
        output: `const ExpensiveComponent = React.memo(function ExpensiveComponent() {
  return <div>Expensive</div>;
});`,
      },
      // observer wrapping forwardRef with anonymous - should error on forwardRef
      {
        code: `const EnhancedButton = observer(
  forwardRef((props, ref) => <button ref={ref}>Click</button>)
);`,
        options: optionsWithBuiltinHocs,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'forwardRef' },
          },
        ],
        output: null,
      },
    ],
  },
);

ruleTester.run(
  `${ruleName} - object name matching`,
  requireNamedWrappedComponentRule,
  {
    valid: [
      // Named function in VariantContext.createComponent
      {
        code: `const Foo = VariantContext.createComponent(function Foo() {
        return <div/>;
      });`,
        options: [{ hocNames: ['VariantContext'] }] satisfies RuleOptions,
      },
      // Reference to named component
      {
        code: `const FooBase = () => <div/>;
const Foo = VariantContext.createComponent(FooBase);`,
        options: [{ hocNames: ['VariantContext'] }] satisfies RuleOptions,
      },
      // Different method on same object
      {
        code: `const Foo = VariantContext.withVariant(function Foo() {
        return <div/>;
      });`,
        options: [{ hocNames: ['VariantContext'] }] satisfies RuleOptions,
      },
      // Not a configured object
      {
        code: `const Foo = OtherContext.createComponent(() => <div/>);`,
        options: [{ hocNames: ['VariantContext'] }] satisfies RuleOptions,
      },
    ],

    invalid: [
      // Anonymous arrow function in VariantContext.createComponent
      {
        code: `const Foo = VariantContext.createComponent(() => <div/>);`,
        options: [{ hocNames: ['VariantContext'] }] satisfies RuleOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'VariantContext.createComponent' },
          },
        ],
        output: `const Foo = VariantContext.createComponent(function Foo() { return <div/>; });`,
      },
      // Anonymous function expression
      {
        code: `const Foo = VariantContext.createComponent(function () {
  return <div/>;
});`,
        options: [{ hocNames: ['VariantContext'] }] satisfies RuleOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'VariantContext.createComponent' },
          },
        ],
        output: `const Foo = VariantContext.createComponent(function Foo() {
  return <div/>;
});`,
      },
      // Different method on the same object
      {
        code: `const Bar = VariantContext.withVariant(() => <span/>);`,
        options: [{ hocNames: ['VariantContext'] }] satisfies RuleOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'VariantContext.withVariant' },
          },
        ],
        output: `const Bar = VariantContext.withVariant(function Bar() { return <span/>; });`,
      },
    ],
  },
);

ruleTester.run(
  `${ruleName} - property name matching`,
  requireNamedWrappedComponentRule,
  {
    valid: [
      // Named function with property name config
      {
        code: `const Foo = AnyContext.createComponent(function Foo() {
        return <div/>;
      });`,
        options: [{ hocNames: ['createComponent'] }] satisfies RuleOptions,
      },
      // Reference to named component
      {
        code: `const FooBase = () => <div/>;
const Foo = SomeContext.createComponent(FooBase);`,
        options: [{ hocNames: ['createComponent'] }] satisfies RuleOptions,
      },
      // Not a configured property name
      {
        code: `const Foo = SomeContext.otherMethod(() => <div/>);`,
        options: [{ hocNames: ['createComponent'] }] satisfies RuleOptions,
      },
    ],

    invalid: [
      // Anonymous arrow function with property name config
      {
        code: `const Foo = AnyContext.createComponent(() => <div/>);`,
        options: [{ hocNames: ['createComponent'] }] satisfies RuleOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'AnyContext.createComponent' },
          },
        ],
        output: `const Foo = AnyContext.createComponent(function Foo() { return <div/>; });`,
      },
      // Different object, same property name
      {
        code: `const Bar = OtherContext.createComponent(() => <span/>);`,
        options: [{ hocNames: ['createComponent'] }] satisfies RuleOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'OtherContext.createComponent' },
          },
        ],
        output: `const Bar = OtherContext.createComponent(function Bar() { return <span/>; });`,
      },
    ],
  },
);

ruleTester.run(
  `${ruleName} - TypeScript type preservation`,
  requireNamedWrappedComponentRule,
  {
    valid: [],

    invalid: [
      // Should preserve type parameters
      {
        code: `const Foo = observer(<T,>(props: T) => <div/>);`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const Foo = observer(function Foo<T,>(props: T) { return <div/>; });`,
      },
      // Should preserve return type annotation
      {
        code: `const Foo = observer((props): React.ReactNode => <div/>);`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const Foo = observer(function Foo(props): React.ReactNode { return <div/>; });`,
      },
      // Should preserve both type parameters and return type
      {
        code: `const Foo = observer(<T extends object,>(props: T): React.ReactNode => <div/>);`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const Foo = observer(function Foo<T extends object,>(props: T): React.ReactNode { return <div/>; });`,
      },
      // Should preserve complex type parameters with constraints
      {
        code: `const Foo = observer(<T extends { id: string }, K extends keyof T>(props: T, key: K): JSX.Element => {
  return <div>{props[key]}</div>;
});`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const Foo = observer(function Foo<T extends { id: string }, K extends keyof T>(props: T, key: K): JSX.Element {
  return <div>{props[key]}</div>;
});`,
      },
      // Should handle generic anonymous function expression
      {
        code: `const Foo = observer(function <T>(x: T) { return <div>{x}</div>; });`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const Foo = observer(function Foo<T>(x: T) { return <div>{x}</div>; });`,
      },
      // Should handle generic anonymous function expression with constraints
      {
        code: `const Foo = observer(function <T extends object>(props: T) {
  return <div/>;
});`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const Foo = observer(function Foo<T extends object>(props: T) {
  return <div/>;
});`,
      },
    ],
  },
);

ruleTester.run(
  `${ruleName} - comment preservation`,
  requireNamedWrappedComponentRule,
  {
    valid: [],

    invalid: [
      // Comments inside function body should be preserved
      {
        code: `const Foo = observer(() => {
  // This is a comment inside the body
  return <div/>;
});`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const Foo = observer(function Foo() {
  // This is a comment inside the body
  return <div/>;
});`,
      },
      // Comments inside parameter (after destructuring) should be preserved
      {
        code: `const Foo = observer(({ onClick /* click handler */ }) => {
  return <button onClick={onClick}/>;
});`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const Foo = observer(function Foo({ onClick /* click handler */ }) {
  return <button onClick={onClick}/>;
});`,
      },
      // Multi-line comments in body should be preserved
      {
        code: `const Foo = observer(() => {
  /**
   * JSDoc style comment
   */
  return <div/>;
});`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const Foo = observer(function Foo() {
  /**
   * JSDoc style comment
   */
  return <div/>;
});`,
      },
      // Comments inside anonymous function expression body should be preserved
      {
        code: `const Foo = observer(function () {
  // comment in function expression
  return <div/>;
});`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const Foo = observer(function Foo() {
  // comment in function expression
  return <div/>;
});`,
      },
      // Comment between parameters should be preserved
      {
        code: `const Foo = observer((props, /* separator */ context) => {
  return <div/>;
});`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const Foo = observer(function Foo(props, /* separator */ context) {
  return <div/>;
});`,
      },
      // Multiple comments between multiple parameters
      {
        code: `const Foo = observer((a, /* first */ b, /* second */ c) => <div/>);`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const Foo = observer(function Foo(a, /* first */ b, /* second */ c) { return <div/>; });`,
      },
      // Multi-line parameters with comments
      {
        code: `const Foo = observer((
  props, // props comment
  ref // ref comment
) => {
  return <div/>;
});`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const Foo = observer(function Foo(
  props, // props comment
  ref // ref comment
) {
  return <div/>;
});`,
      },
      // Nested parentheses in parameter type (function type)
      {
        code: `const Foo = observer((props: { onClick: (e: Event) => void }) => <div/>);`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const Foo = observer(function Foo(props: { onClick: (e: Event) => void }) { return <div/>; });`,
      },
      // Multiple nested parentheses in parameters
      {
        code: `const Foo = observer((fn: (a: (b: number) => string) => void, cb: () => void) => <div/>);`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const Foo = observer(function Foo(fn: (a: (b: number) => string) => void, cb: () => void) { return <div/>; });`,
      },
      // Nested parentheses with comments
      {
        code: `const Foo = observer((
  props: { onClick: (e: Event) => void }, // click handler type
  ref
) => {
  return <div/>;
});`,
        options: defaultOptions,
        errors: [
          {
            messageId: 'requireNamedComponent',
            data: { hocName: 'observer' },
          },
        ],
        output: `const Foo = observer(function Foo(
  props: { onClick: (e: Event) => void }, // click handler type
  ref
) {
  return <div/>;
});`,
      },
    ],
  },
);
