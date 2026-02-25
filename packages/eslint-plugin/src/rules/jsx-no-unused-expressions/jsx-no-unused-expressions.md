# @rightcapital/jsx-no-unused-expressions

📝 Disallow unused JSX expressions.

💼 This rule is enabled in the following configs: ☑️ `recommended-jsx`, ✅ `recommended-react`.

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
