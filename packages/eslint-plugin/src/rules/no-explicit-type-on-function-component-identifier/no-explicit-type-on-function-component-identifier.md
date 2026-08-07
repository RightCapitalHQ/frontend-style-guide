# @rightcapital/no-explicit-type-on-function-component-identifier

📝 Disallow explicitly specifying type for function component identifier. (This rule requires `typescript-eslint`).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Prefer annotating a function component's props parameter instead of its variable identifier. This keeps the component as a plain function and lets TypeScript infer its return type.

## Fail

The rule reports direct arrow function or function expression components whose identifiers use one of these explicit React component types:

- `FC` or `React.FC`
- `FunctionComponent` or `React.FunctionComponent`
- `ComponentClass` or `React.ComponentClass`
- `ComponentType` or `React.ComponentType`

```tsx
const Button: React.FC<ButtonProps> = ({ label }) => {
  return <button>{label}</button>;
};
```

```tsx
const Button: FunctionComponent<ButtonProps> = function ({ label }) {
  return <button>{label}</button>;
};
```

```tsx
const Button: React.ComponentType<ButtonProps> = ({ label }) => {
  return <button>{label}</button>;
};
```

## Pass

Annotate the props parameter and let TypeScript infer the component's return type:

```tsx
const Button = ({ label }: ButtonProps) => {
  return <button>{label}</button>;
};
```

Function declarations and explicit return types are allowed because the rule only checks variable identifiers:

```tsx
function Button({ label }: ButtonProps): React.JSX.Element {
  return <button>{label}</button>;
}
```

Custom callable types are also allowed:

```tsx
const Button: (props: ButtonProps) => React.ReactElement = ({ label }) => {
  return <button>{label}</button>;
};
```

The rule only checks direct arrow function and function expression initializers. It does not report component types used elsewhere, including higher-order component results and type declarations:

```tsx
const Button: React.FC<ButtonProps> = React.memo(({ label }) => {
  return <button>{label}</button>;
});

type ButtonWithStatics = React.FC<ButtonProps> & {
  Group: typeof ButtonGroup;
};
```

## Auto-fix

When an explicit function component type has one type argument and the function has one untyped props parameter, the fix moves that type argument to the props parameter:

```tsx
// Before
const Button: React.FC<ButtonProps> = ({ label }) => {
  return <button>{label}</button>;
};

// After
const Button = ({ label }: ButtonProps) => {
  return <button>{label}</button>;
};
```

If the props parameter already has a type annotation, the fix keeps that annotation and removes only the component identifier's type:

```tsx
// Before
const Button: React.FC<ButtonProps> = ({ label }: CustomButtonProps) => {
  return <button>{label}</button>;
};

// After
const Button = ({ label }: CustomButtonProps) => {
  return <button>{label}</button>;
};
```
