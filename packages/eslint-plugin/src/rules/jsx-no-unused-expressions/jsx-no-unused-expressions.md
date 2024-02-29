# Disallow unused JSX expressions (`@rightcapital/jsx-no-unused-expressions`)

💼 This rule is enabled in the `recommended-jsx` config.

<!-- end auto-generated rule header -->

## Fail

```jsx
<div />
```

```jsx
function Foo() {
  <div />;
}
```

## Pass

```jsx
const element = <div />;
```

```jsx
function Foo() {
  return <div />;
}
```

```jsx
const Foo = () => <div />;
```
